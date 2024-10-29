// test/transaction.test.js
const httpMocks = require('node-mocks-http');
const transactionController = require('../src/controllers/transactionController');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        transaction: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        bankAccount: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Transaction Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    test('should create a new transaction', async () => {
        const mockSourceAccount = { id: 1, balance: 1000 };
        const mockDestinationAccount = { id: 2, balance: 500 };
        prisma.bankAccount.findUnique.mockImplementation((opts) => {
            if (opts.where.id === 1) return mockSourceAccount;
            if (opts.where.id === 2) return mockDestinationAccount;
            return null;
        });

        req.body = {
            sourceAccountId: 1,
            destinationAccountId: 2,
            amount: 200,
        };

        const mockTransaction = { id: 1, sourceAccountId: 1, destinationAccountId: 2, amount: 200 };
        prisma.transaction.create.mockResolvedValue(mockTransaction);

        await transactionController.createTransaction(req, res, next);

        expect(prisma.bankAccount.update).toHaveBeenCalledTimes(2); // Update kedua akun
        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res._getData())).toEqual(mockTransaction);
    });

    test('should return 400 for insufficient balance in source account', async () => {
        const mockSourceAccount = { id: 1, balance: 100 };
        const mockDestinationAccount = { id: 2, balance: 500 };
        prisma.bankAccount.findUnique.mockImplementation((opts) => {
            if (opts.where.id === 1) return mockSourceAccount;
            if (opts.where.id === 2) return mockDestinationAccount;
            return null;
        });

        req.body = {
            sourceAccountId: 1,
            destinationAccountId: 2,
            amount: 200, // Jumlah lebih dari saldo
        };

        await transactionController.createTransaction(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Insufficient balance in source account' });
    });

    test('should return 404 if source or destination account not found', async () => {
        prisma.bankAccount.findUnique.mockResolvedValueOnce(null); // Sumber akun tidak ditemukan

        req.body = {
            sourceAccountId: 999, // ID yang tidak ada
            destinationAccountId: 2,
            amount: 200,
        };

        await transactionController.createTransaction(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Source or destination account not found' });
    });

    test('should get all transactions', async () => {
        const mockTransactions = [
            { id: 1, sourceAccountId: 1, destinationAccountId: 2, amount: 200 },
            { id: 2, sourceAccountId: 2, destinationAccountId: 1, amount: 100 },
        ];
        prisma.transaction.findMany.mockResolvedValue(mockTransactions);

        await transactionController.getAllTransactions(req, res, next);

        expect(JSON.parse(res._getData())).toEqual(mockTransactions);
        expect(res.statusCode).toBe(200);
    });

    test('should get transaction by ID', async () => {
        const mockTransaction = { id: 1, sourceAccountId: 1, destinationAccountId: 2, amount: 200 };
        prisma.transaction.findUnique.mockResolvedValue(mockTransaction);

        req.params = { transactionId: 1 };
        await transactionController.getTransactionById(req, res, next);

        expect(JSON.parse(res._getData())).toEqual(mockTransaction);
        expect(res.statusCode).toBe(200);
    });

    test('should return 404 if transaction not found', async () => {
        prisma.transaction.findUnique.mockResolvedValue(null); // Transaksi tidak ditemukan

        req.params = { transactionId: 999 }; // ID yang tidak ada
        await transactionController.getTransactionById(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Transaction not found' });
    });
});