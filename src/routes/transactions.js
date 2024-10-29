// src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Rute untuk membuat transaksi baru
router.post('/', transactionController.createTransaction);

// Rute untuk mendapatkan semua transaksi
router.get('/', transactionController.getAllTransactions);

// Rute untuk mendapatkan transaksi berdasarkan ID
router.get('/:transactionId', transactionController.getTransactionById);

module.exports = router;