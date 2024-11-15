const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let notifications = [];

const addNotification = async (userId, message) => {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: userId,
          message: message,
          read: false, // Notifikasi dianggap belum dibaca
        },
      });
      return notification;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  };

  const getNotifications = async (req, res, next) => {
    try {
      const userId = req.user.id; // Ambil userId dari sesi atau token login
  
      // Ambil semua notifikasi untuk user dari database
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }, // Urutkan berdasarkan waktu terbaru
      });
  
      // Kirim data notifikasi ke halaman EJS
      res.render('notifications', { notifications });
    } catch (err) {
      next(err);
    }
  };

module.exports = {
    addNotification,
    getNotifications
};