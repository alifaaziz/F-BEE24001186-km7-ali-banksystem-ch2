const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Account
router.post('/', async (req, res, next) => {
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
});

// Get All Accounts
router.get('/', async (req, res, next) => {
    try {
        const accounts = await prisma.bankAccount.findMany();
        res.json(accounts);
    } catch (err) {
        next(err);
    }
});

// Get Account by ID
router.get('/:accountId', async (req, res, next) => {
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
});

// Deposit
router.post('/deposit', async (req, res, next) => {
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
});


// Withdraw
router.post('/withdraw', async (req, res, next) => {
    try {
        const { accountId, amount } = req.body;

        const account = await prisma.bankAccount.update({
            where: { id: accountId },
            data: {
                balance: {
                    decrement: amount
                }
            }
        });

        res.json(account);
    } catch (err) {
        next(err);
    }
});

module.exports = router;