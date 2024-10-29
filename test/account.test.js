// test/account.test.js
const httpMocks = require('node-mocks-http');
const accountController = require('../src/controllers/accountController');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        bankAccount: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Account Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    test('should create a new account', async () => {
        const mockAccount = { id: 1, userId: 1, bankName: 'Bank A', bankAccountNumber: '123456789', balance: 0 };
        prisma.bankAccount.create.mockResolvedValue(mockAccount);

        req.body = {
            userId: 1,
            bankName: 'Bank A',
            bankAccountNumber: '123456789',
        };

        await accountController.createAccount(req, res, next);

        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res._getData())).toEqual(mockAccount);
    });

    test('should get all accounts', async () => {
        const mockAccounts = [{ id: 1, userId: 1, bankName: 'Bank A', bankAccountNumber: '123456789', balance: 0 }];
        prisma.bankAccount.findMany.mockResolvedValue(mockAccounts);

        await accountController.getAllAccounts(req, res, next);

        expect(JSON.parse(res._getData())).toEqual(mockAccounts);
        expect(res.statusCode).toBe(200);
    });

    test('should get account by ID', async () => {
        const mockAccount = { id: 1, userId: 1, bankName: 'Bank A', bankAccountNumber: '123456789', balance: 0 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);

        req.params = { accountId: 1 };
        await accountController.getAccountById(req, res, next);

        expect(JSON.parse(res._getData())).toEqual(mockAccount);
        expect(res.statusCode).toBe(200);
    });

    test('should return 404 if account not found', async () => {
        prisma.bankAccount.findUnique.mockResolvedValue(null);

        req.params = { accountId: 999 }; // ID yang tidak ada
        await accountController.getAccountById(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Account not found' });
    });

    test('should deposit amount to account', async () => {
        const mockAccount = { id: 1, userId: 1, bankName: 'Bank A', bankAccountNumber: '123456789', balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);

        const depositAmount = 500;
        req.body = { accountId: 1, amount: depositAmount };

        const updatedAccount = { ...mockAccount, balance: mockAccount.balance + depositAmount };
        prisma.bankAccount.update.mockResolvedValue(updatedAccount);

        await accountController.deposit(req, res, next);

        expect(JSON.parse(res._getData())).toEqual(updatedAccount);
        expect(res.statusCode).toBe(200);
    });

    test('should withdraw amount from account', async () => {
        const mockAccount = { id: 1, userId: 1, bankName: 'Bank A', bankAccountNumber: '123456789', balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);

        const withdrawAmount = 500;
        req.body = { accountId: 1, amount: withdrawAmount };

        const updatedAccount = { ...mockAccount, balance: mockAccount.balance - withdrawAmount };
        prisma.bankAccount.update.mockResolvedValue(updatedAccount);

        await accountController.withdraw(req, res, next);

        expect(JSON.parse(res._getData())).toEqual(updatedAccount);
        expect(res.statusCode).toBe(200);
    });

    test('should return 400 for insufficient balance during withdrawal', async () => {
        const mockAccount = { id: 1, userId: 1, bankName: 'Bank A', bankAccountNumber: '123456789', balance: 300 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);

        req.body = { accountId: 1, amount: 500 }; // Mencoba menarik lebih dari saldo
        await accountController.withdraw(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Insufficient balance' });
    });
});