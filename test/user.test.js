const { PrismaClient } = require('@prisma/client');
const userController = require('../src/controllers/userController'); // Sesuaikan dengan path Anda
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

        // Mocking the Prisma methods
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
});