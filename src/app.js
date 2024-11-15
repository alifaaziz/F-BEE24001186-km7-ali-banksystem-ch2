require('dotenv').config();
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

// Middleware
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

// Error Handling Middleware
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

module.exports = server;