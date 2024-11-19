// src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { addNotification } = require('./notificationController');
const fs = require('fs');
const path = require('path');
const Sentry = require("@sentry/node");

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

const sendOtpEmail = async (userEmail, userName, otp) => {
    try {
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../views/emails/otp-email-template.html'), 'utf-8');

        const htmlContent = htmlTemplate.replace('{{name}}', userName).replace('{{otp}}', otp);

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: userEmail,
            subject: 'Your OTP Code for Registration',
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Error sending OTP email');
        Sentry.captureException(error);
    }
};

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
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Kedaluwarsa dalam 10 menit

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
        await sendOtpEmail(user.email, user.name, otp);

        res.status(201).json({ message: 'Registration successful. Please verify your OTP sent to your email.' });
    } catch (error) {
        Sentry.captureException(error);
        next(error);
    }
};

  const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

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

        // Tambahkan notifikasi
        const notificationMessage = `Welcome ${user.name}, your account has been successfully registered!`;
        await addNotification(user.id, notificationMessage);

        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET_KEY || 'your_default_secret_key',
          { expiresIn: '1h' }
      );

      res.status(200).json({
          message: 'OTP verified successfully. Registration completed.',
          token,
      });
    } catch (error) {
        Sentry.captureException(error);
        next(error);
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
    } catch (error) {
        Sentry.captureException(error);
        next(error);
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
    } catch (error) {
        Sentry.captureException(error);
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Cek apakah email ada di database
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        // Generate token untuk reset password
        const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // Token berlaku 30 menit

        // Simpan token dan waktu kedaluwarsa ke database
        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken,
                resetPasswordExpiresAt,
            },
        });

        // Kirim email dengan link reset password
        const resetUrl = `${process.env.MY_URL}/api/v1/auth/reset-password/${resetPasswordToken}`;
        await sendResetPasswordEmail(user.email, user.name, resetUrl);

        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        Sentry.captureException(error);
        next(error);
    }
};

const sendResetPasswordEmail = async (userEmail, userName, resetUrl) => {
    try {
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../views/emails/reset-password.html'), 'utf-8');

        const htmlContent = htmlTemplate.replace('{{name}}', userName).replace('{{resetUrl}}', resetUrl);

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: userEmail,
            subject: 'Reset Your Password',
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error sending password reset email:', error);
        throw new Error('Error sending password reset email');
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;

        // Menggunakan findFirst() untuk mencari berdasarkan resetPasswordToken
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
            },
        });

        // Mengecek apakah user tidak ditemukan atau token sudah kadaluarsa
        if (!user || new Date() > user.resetPasswordExpiredAt) {
            return res.status(400).render('reset-password', { message: 'Token is invalid or expired' });
        }

        // Jika token valid, tampilkan halaman reset password
        res.render('reset-password', {
            token: user.resetPasswordToken,
            email: user.email,
        });
    } catch (error) {
        Sentry.captureException(error);
        next(error);
    }
};

const resetPasswordAction = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        // Cari user berdasarkan token reset password
        const user = await prisma.user.findUnique({
            where: {
                resetPasswordToken: token,  // Cari berdasarkan token saja
            },
        });

        if (!user || new Date() > user.resetPasswordExpiresAt) {
            return res.status(400).json({ message: 'Token is invalid or expired' });
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(password, 10);

        // Perbarui password dan reset token di database
        await prisma.user.update({
            where: { resetPasswordToken: token },  // Update berdasarkan token
            data: {
                password: hashedPassword,
                resetPasswordToken: null,  // Hapus token setelah reset
                resetPasswordExpiresAt: null,  // Hapus waktu kedaluwarsa token
            },
        });

        const notificationMessage = `Hello ${user.name}, Your password has been changed successfully!`;
        await addNotification(user.id, notificationMessage);

        res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (error) {
        Sentry.captureException(error);
        next(error);
    }
};

module.exports = { register, login, whoAmI, verifyOtp, forgotPassword, resetPassword, resetPasswordAction };