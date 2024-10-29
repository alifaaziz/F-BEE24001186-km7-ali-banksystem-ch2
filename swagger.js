const swaggerAutogen = require('swagger-autogen')();

const doc = {
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
};

const outputFile = './swagger-output.json';
const routes = ['./routes/*.js'];


swaggerAutogen(outputFile, routes, doc);