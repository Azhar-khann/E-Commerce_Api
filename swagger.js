const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'API for registering users, logging them and managing user accounts, products, carts, and orders in an e-commerce store.',
        },
    },
    apis: [],
};

// Load your YAML file
options.apis.push('./api_doc.yaml');

const specs = swaggerJsdoc(options);

module.exports = specs;
