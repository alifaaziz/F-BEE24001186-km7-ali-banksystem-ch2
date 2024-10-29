// src/controllers/transactionController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Transaction
const createTransaction = async (req, res, next) => {
    try {
        const { sourceAccountId, destinationAccountId, amount } = req.body;

        // Validasi input
        if (!sourceAccountId || !destinationAccountId || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid source account ID, destination account ID, or amount' });
        }

        // Temukan akun sumber dan tujuan
        const sourceAccount = await prisma.bankAccount.findUnique({
            where: { id: sourceAccountId },
        });

        const destinationAccount = await prisma.bankAccount.findUnique({
            where: { id: destinationAccountId },
        });

        if (!sourceAccount || !destinationAccount) {
            return res.status(404).json({ message: 'Source or destination account not found' });
        }

        // Cek apakah saldo cukup di akun sumber
        if (sourceAccount.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance in source account' });
        }

        // Lakukan transfer: kurangi dari akun sumber dan tambahkan ke akun tujuan
        await prisma.bankAccount.update({
            where: { id: sourceAccountId },
            data: { balance: sourceAccount.balance - amount },
        });

        await prisma.bankAccount.update({
            where: { id: destinationAccountId },
            data: { balance: destinationAccount.balance + amount },
        });

        // Simpan transaksi
        const transaction = await prisma.transaction.create({
            data: {
                sourceAccountId,
                destinationAccountId,
                amount,
            },
        });

        res.status(201).json(transaction);
    } catch (err) {
        next(err);
    }
};

// Get All Transactions
const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                sourceAccount: {
                    select: { id: true, bankAccountNumber: true }
                },
                destinationAccount: {
                    select: { id: true, bankAccountNumber: true }
                },
            },
        });
        res.json(transactions);
    } catch (err) {
        next(err);
    }
};

// Get Transaction by ID
const getTransactionById = async (req, res, next) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: parseInt(req.params.transactionId) },
            include: {
                sourceAccount: {
                    select: { id: true, bankAccountNumber: true }
                },
                destinationAccount: {
                    select: { id: true, bankAccountNumber: true }
                },
            },
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
};