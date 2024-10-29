// test/auth.test.js
const httpMocks = require('node-mocks-http');
const authController = require('../src/controllers/authController');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    test('should register a new user', async () => {
        req.body = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            profile: {
                identityType: 'KTP',
                identityNumber: '1234567890123456',
                address: 'Jl. Contoh No. 1',
            },
        };

        prisma.user.findUnique.mockResolvedValue(null); // User tidak ada
        bcrypt.hash.mockResolvedValue('hashedPassword');

        const mockUser = {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            profile: {},
        };
        prisma.user.create.mockResolvedValue(mockUser);

        await authController.register(req, res, next);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: 'hashedPassword',
                profile: {
                    create: req.body.profile,
                },
            },
        });
        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res._getData())).toEqual(mockUser);
    });

    test('should return 400 if email is already registered', async () => {
        req.body = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            profile: {
                identityType: 'KTP',
                identityNumber: '1234567890123456',
                address: 'Jl. Contoh No. 1',
            },
        };

        prisma.user.findUnique.mockResolvedValue({ id: 1 }); // User ditemukan

        await authController.register(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Email is already registered' });
    });

    test('should login an existing user', async () => {
        req.body = {
            email: 'john.doe@example.com',
            password: 'password123',
        };

        const mockUser = {
            id: 1,
            email: 'john.doe@example.com',
            password: 'hashedPassword',
        };
        prisma.user.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('token');

        await authController.login(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({ token: 'token' });
    });

    test('should return 401 for invalid email or password', async () => {
        req.body = {
            email: 'john.doe@example.com',
            password: 'wrongpassword',
        };

        const mockUser = {
            id: 1,
            email: 'john.doe@example.com',
            password: 'hashedPassword',
        };
        prisma.user.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); // Password tidak cocok

        await authController.login(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Invalid email or password' });
    });

    test('should return user information in whoAmI', async () => {
        req.user = { userId: 1 };

        const mockUser = {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            profile: {},
        };
        prisma.user.findUnique.mockResolvedValue(mockUser);

        await authController.whoAmI(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res._getData())).toEqual(mockUser);
    });

    test('should return 404 if user not found in whoAmI', async () => {
        req.user = { userId: 999 }; // ID tidak ada

        prisma.user.findUnique.mockResolvedValue(null); // User tidak ditemukan

        await authController.whoAmI(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res._getData())).toEqual({ message: 'User not found' });
    });
});
