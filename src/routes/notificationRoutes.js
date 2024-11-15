const express = require('express');
const router = express.Router();

// Import controller
const notificationController = require('../controllers/notificationController');

// Route untuk menampilkan notifikasi
router.get('/', notificationController.getNotifications);

// Route untuk menambahkan notifikasi setelah registrasi
router.post('/add', notificationController.addNotification);

module.exports = router;