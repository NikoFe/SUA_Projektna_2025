const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gamification Service API",
      version: "1.0.0",
      description: "API for managing gamification points and experience."
    },
    servers: [
      { url: "http://localhost:6005" }
    ]
  },
  apis: ["./index.js"]  // Point to files with JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};