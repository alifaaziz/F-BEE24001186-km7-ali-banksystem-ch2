const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Joi = require('joi');

// Skema validasi untuk user
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    profile: Joi.object({
        identityType: Joi.string().required(), // Ubah sesuai dengan field di database
        identityNumber: Joi.string().required(),
        address: Joi.string().required(),
    }).required(),
});

// Menambahkan user baru beserta profilnya
router.post('/', async (req, res, next) => {
    try {
        const { value, error } = userSchema.validate(req.body);
        if (error) {
            console.log('Validation Error:', error); // Log error validasi
            return res.status(400).json({ message: error.message });
        }

        const { name, email, password, profile } = value;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                profile: {
                    create: profile
                }
            }
        });

        res.status(201).json(user);
    } catch (err) {
        console.error('Error Creating User:', err); // Log error saat pembuatan user
        next(err);
    }
});

// Menampilkan daftar users
router.get('/', async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            include: { profile: true } // Pastikan ini sesuai dengan relasi Anda
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// Menampilkan detail informasi user (termasuk profil)
router.get('/:userId', async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.userId) },
            include: { profile: true },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});

module.exports = router;