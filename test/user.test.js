// test/user.test.js
const { PrismaClient } = require('@prisma/client');
const userController = require('../src/controllers/userController');
const httpMocks = require('node-mocks-http');

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('User Controller', () => {
    let req, res, next;
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();

        prisma.user.findMany.mockResolvedValue([mockUser]);
        prisma.user.findUnique.mockResolvedValue(mockUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should get all users', async () => {
        await userController.getUsers(req, res, next);
        expect(JSON.parse(res._getData())).toEqual([mockUser]);
        expect(res.statusCode).toBe(200);
    });
    
    test('should get user by ID', async () => {
        req.params = { userId: 1 };
        await userController.getUserById(req, res, next);
        expect(JSON.parse(res._getData())).toEqual(mockUser); 
        expect(res.statusCode).toBe(200);
    });
    
    test('should return 404 if user not found', async () => {
        prisma.user.findUnique.mockResolvedValue(null);
        req.params = { userId: 999 };
        await userController.getUserById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res._getData())).toEqual({ message: 'User not found' });
    });

    test('should call next with an error if database fails on get all users', async () => {
        const mockError = new Error('Database error');
        prisma.user.findMany.mockRejectedValue(mockError);

        await userController.getUsers(req, res, next);

        expect(next).toHaveBeenCalledWith(mockError);
        expect(res.statusCode).toBe(200);
    });

    test('should call next with an error if database fails on get user by ID', async () => {
        const mockError = new Error('Database error');
        prisma.user.findUnique.mockRejectedValue(mockError);

        req.params = { userId: 1 };
        await userController.getUserById(req, res, next);

        expect(next).toHaveBeenCalledWith(mockError);
        expect(res.statusCode).toBe(200);
    });
});