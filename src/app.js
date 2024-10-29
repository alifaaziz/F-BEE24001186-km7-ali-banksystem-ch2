require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('../swagger-output.json');
const expressSwagger = require('express-swagger-generator');
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/authRoutes');

const app = express();
const prisma = new PrismaClient();

// Swagger Setup
let options = {
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
                description: "",
            },
        },
    },
    basedir: __dirname,
    files: ['./routes/*.js'],
};
expressSwagger(app)(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Basic Banking System API');
});
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/auth', authRoutes);

// Error handling
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
});

module.exports = app;