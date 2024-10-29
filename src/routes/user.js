// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute untuk mendapatkan daftar pengguna
router.get('/', userController.getUsers);

// Rute untuk mendapatkan detail pengguna berdasarkan ID
router.get('/:userId', userController.getUserById);

module.exports = router;