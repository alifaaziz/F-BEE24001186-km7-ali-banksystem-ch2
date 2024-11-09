const jwt = require('jsonwebtoken');

// Mengambil nilai JWT_SECRET_KEY dari environment variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_default_secret_key';

const restrict = (req, res, next) => {
    // Mengambil token dari header Authorization
    const { authorization } = req.headers;

    // Memeriksa apakah token tersedia
    if (!authorization) {
        return res.status(401).json({
            status: false,
            message: "You're not authorized!",
            data: null,
        });
    }

    // Memisahkan token dari format Bearer
    const token = authorization.split(' ')[1];

    // Memverifikasi token JWT
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                message: "You're not authorized!",
                err: err.message,
                data: null,
            });
        }

        // Jika token valid, tambahkan data pengguna ke req.user
        req.user = decoded;
        next(); // Melanjutkan ke middleware berikutnya atau handler route
    });
};

module.exports = restrict;