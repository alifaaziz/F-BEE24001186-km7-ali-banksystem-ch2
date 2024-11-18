const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let notifications = [];

const addNotification = async (userId, message) => {
  try {
      const notification = await prisma.notification.create({
          data: {
              userId: userId,
              message: message,
              read: false,
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
      const notifications = await prisma.notification.findMany({
          select: {
              message: true,
              createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
      });

      res.render('notifications', { notifications });
      } catch (err) {
      next(err);
    }
  };

module.exports = {
    addNotification,
    getNotifications
};