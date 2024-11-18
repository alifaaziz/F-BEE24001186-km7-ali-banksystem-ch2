const express = require('express');
const router = express.Router();
const { addNotification, getNotifications } = require('../controllers/notificationController');
const restrict = require('../middlewares/restrict');


// Route untuk menampilkan notifikasi
router.get('/', getNotifications);

// Route untuk menambahkan notifikasi setelah registrasi
router.post('/add', addNotification);

module.exports = router;