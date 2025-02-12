require('dotenv').config();
const logger = require('./config/logger');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./config/swaggerConfig');
const mapGenRoute = require('./routes/mapGenRoute');
const userLogoutConsumer = require('./consumers/userLogoutConsumer');
const authLoginConsumer = require('./consumers/authLoginConsumer');

const app = express();
const port = process.env.PORT || 3090;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'AI-Mapbot' });
});

// Routes
app.use('/', mapGenRoute);

// Start server
app.listen(port, '0.0.0.0', async () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
    console.log(`Documentation available at http://0.0.0.0:${port}/api-docs`);
    
    try {
      // Inicializar consumidores de Kafka
      await authLoginConsumer.run();
      logger.info('Login consumer initialized successfully');
      
      await userLogoutConsumer.run();
      logger.info('Logout consumer initialized successfully');
    } catch (error) {
      logger.error('Error initializing Kafka consumers:', error);
    }
  });

  process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  logger.info('Starting graceful shutdown...');
  if (redisClient.isReady) {
    try {
      await redisClient.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis:', error);
    }
  }
  process.exit(0);
}