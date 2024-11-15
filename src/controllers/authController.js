// src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { addNotification } = require('./notificationController');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    profile: Joi.object({
        identityType: Joi.string().required(),
        identityNumber: Joi.string().required(),
        address: Joi.string().required(),
    }).required(),
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SENDER, 
        pass: process.env.EMAIL_PASSWORD,
    },
});

const register = async (req, res, next) => {
    try {
      const { value, error } = registerSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });
  
      const { name, email, password, profile } = value;
  
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Kedaluwarsa dalam 5 menit
  
      // Simpan data pengguna dan OTP ke database
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          otp,
          otpExpiresAt,
          profile: {
            create: profile,
          },
        },
      });
  
      // Kirim OTP melalui email
      const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Your OTP Code for Registration',
        text: `Your OTP code is: ${otp}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(201).json({ message: 'Registration successful. Please verify your OTP sent to your email.' });
    } catch (err) {
      next(err);
    }
  };

  const verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
      }
  
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // Reset OTP setelah berhasil diverifikasi
      await prisma.user.update({
        where: { email },
        data: {
          otp: null,
          otpExpiresAt: null,
        },
      });
  
      // Menambahkan notifikasi setelah OTP diverifikasi
      await addNotification(user.id, `Welcome ${user.name}, your account has been verified! Now you can explore the system.`);
  
      res.status(200).json({ message: 'OTP verified successfully. Registration completed.' });
    } catch (err) {
      next(err);
    }
  };
  
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        next(err);
    }
};

const whoAmI = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, whoAmI, verifyOtp };