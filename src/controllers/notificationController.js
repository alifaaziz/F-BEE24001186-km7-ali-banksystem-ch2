const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Sentry = require("@sentry/node");
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
      Sentry.captureException(error);
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
      } catch (error) {
      Sentry.captureException(error);
      next(error);
    }
  };

module.exports = {
    addNotification,
    getNotifications
};