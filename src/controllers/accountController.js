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
    } catch (err) {
        next(err);
    }
};

// Get All Accounts
const getAllAccounts = async (req, res, next) => {
    try {
        const accounts = await prisma.bankAccount.findMany();
        res.json(accounts);
    } catch (err) {
        next(err);
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
    } catch (err) {
        next(err);
    }
};

// Deposit
const deposit = async (req, res, next) => {
    try {
        const { accountId, amount } = req.body;

        // Validasi input
        if (!accountId || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid account ID or amount' });
        }

        // Temukan akun
        const account = await prisma.bankAccount.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Update saldo
        const updatedAccount = await prisma.bankAccount.update({
            where: { id: accountId },
            data: {
                balance: account.balance + amount, // Tambahkan jumlah ke saldo
            },
        });

        res.json(updatedAccount);
    } catch (err) {
        next(err);
    }
};

// Withdraw
const withdraw = async (req, res, next) => {
    try {
        const { accountId, amount } = req.body;

        const account = await prisma.bankAccount.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Update saldo
        const updatedAccount = await prisma.bankAccount.update({
            where: { id: accountId },
            data: {
                balance: account.balance - amount,
            },
        });

        res.json(updatedAccount);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createAccount,
    getAllAccounts,
    getAccountById,
    deposit,
    withdraw,
};