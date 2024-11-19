// Inisialisasi Sentry sebelum mengimpor express
require('dotenv').config();
const Sentry = require('@sentry/node');

// Inisialisasi Sentry dengan DSN yang benar dari file .env
Sentry.init({ 
    dsn: process.env.SENTRY_DSN, // Pastikan DSN diambil dari file .env
    tracesSampleRate: 1.0, // Menentukan tingkat pengambilan trace untuk profiling
    debug: true,  // Mengaktifkan debug mode untuk Sentry
});

// Import dependencies lainnya
const express = require('express');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const expressSwagger = require('express-swagger-generator');

// Routes
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // Import route untuk notifikasi

// Inisialisasi aplikasi Express
const app = express();
const server = createServer(app); // Membuat server HTTP dari Express app
const io = new Server(server);    // Menghubungkan Socket.IO ke server

// Swagger Setup
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            description: 'API documentation for the Basic Banking System',
            title: 'Basic Banking System API',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: '/api/v1',
        produces: ['application/json'],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: '',
            },
        },
    },
    basedir: __dirname, // Menentukan direktori basis untuk mencari file
    files: ['./routes/*.js'], // Mencari semua file route di dalam folder routes
};

// Swagger generator
expressSwagger(app)(swaggerOptions);

// Middleware untuk menangani body request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Setup EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Routes
app.get('/', (req, res) => {
    res.send(`Welcome to the Basic Banking System API (API documentation: /api-docs)`);
});

// Menambahkan routes untuk notifikasi
app.use('/api/v1/notifications', notificationRoutes);  // Gunakan route notifikasi

// Menggunakan route yang telah dibuat
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/image', imageRoutes);

// Middleware error handler untuk Express
Sentry.setupExpressErrorHandler(app);

// Endpoint untuk memicu error ke Sentry
app.get('/debug-sentry', (req, res) => {
    try {
      throw new Error("My first Sentry error!");
    } catch (err) {
      Sentry.captureException(err);  // Mengirim kesalahan ke Sentry
      res.status(500).send("Internal Server Error");
    }
  });

// Error Handling Middleware untuk Express
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.isJoi) {
        return res.status(400).json({
            message: err.message,
        });
    }
    res.status(500).json({
        message: 'Internal server error',
    });
    next();
});

// Custom error handler untuk Sentry
app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

// Menjalankan server
module.exports = server;