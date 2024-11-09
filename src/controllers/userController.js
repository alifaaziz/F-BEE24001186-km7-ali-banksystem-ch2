// src/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Menampilkan daftar pengguna
const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Menampilkan detail informasi pengguna
const getUserById = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.userId) },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Gunakan .json() untuk mengembalikan objek
        }
        res.status(200).json(user); // Gunakan .json() untuk mengembalikan objek
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getUsers,
    getUserById,
};