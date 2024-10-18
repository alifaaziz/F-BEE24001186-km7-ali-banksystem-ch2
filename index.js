const express = require('express');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = 3000;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Rute root
app.get('/', (req, res) => {
    res.send('Welcome to the Basic Banking System API');
});


// Routes
app.use('/api/v1/users', require('./routes/user'));
app.use('/api/v1/accounts', require('./routes/accounts'));
app.use('/api/v1/transactions', require('./routes/transactions'));

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

// Start server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});