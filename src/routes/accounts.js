// src/routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Rute untuk membuat akun baru
router.post('/', accountController.createAccount);

// Rute untuk mendapatkan semua akun
router.get('/', accountController.getAllAccounts);

// Rute untuk mendapatkan akun berdasarkan ID
router.get('/:accountId', accountController.getAccountById);

// Rute untuk melakukan deposit
router.post('/deposit', accountController.deposit);

// Rute untuk melakukan withdraw
router.post('/withdraw', accountController.withdraw);

module.exports = router;