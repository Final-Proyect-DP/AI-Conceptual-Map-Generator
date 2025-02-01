require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./config/swaggerConfig');
const mapGenRoute = require('./routes/mapGenRoute');

const app = express();
const port = process.env.PORT || 3090;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// Routes
app.use('/', mapGenRoute);

// Start server
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
