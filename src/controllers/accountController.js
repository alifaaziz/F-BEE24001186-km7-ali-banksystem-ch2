// src/controllers/accountController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Account
const createAccount = async (req, res, next) => {
    try {
        const { userId, bankName, bankAccountNumber } = req.body;

        const account = await prisma.bankAccount.create({
            data: {
                userId: userId,
                bankName: bankName,
                bankAccountNumber: bankAccountNumber,
                balance: 0 // default balance
            }
        });

        res.status(201).json(account);
    } catch (error) {
        next(error);
    }
};

// Get All Accounts
const getAllAccounts = async (req, res, next) => {
    try {
        const accounts = await prisma.bankAccount.findMany();
        res.json(accounts);
    } catch (error) {
        next(error);
    }
};

// Get Account by ID
const getAccountById = async (req, res, next) => {
    try {
        const account = await prisma.bankAccount.findUnique({
            where: { id: parseInt(req.params.accountId) }
        });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.json(account);
    } catch (error) {
        next(error);
    }
};

// Deposit function
const deposit = async (req, res, next) => {
    const { accountId, amount } = req.body;

    // Validasi jumlah
    if (!accountId || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid account ID or amount' });
    }

    try {
        const account = await prisma.bankAccount.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const updatedAccount = await prisma.bankAccount.update({
            where: { id: accountId },
            data: { balance: account.balance + amount },
        });

        res.status(200).json(updatedAccount);
    } catch (error) {
        next(error);
    }
};

// Withdraw function
const withdraw = async (req, res, next) => {
    const { accountId, amount } = req.body;

    // Validasi jumlah
    if (!accountId || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid account ID or amount' });
    }

    try {
        const account = await prisma.bankAccount.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const updatedAccount = await prisma.bankAccount.update({
            where: { id: accountId },
            data: { balance: account.balance - amount },
        });

        res.status(200).json(updatedAccount);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAccount,
    getAllAccounts,
    getAccountById,
    deposit,
    withdraw,
};