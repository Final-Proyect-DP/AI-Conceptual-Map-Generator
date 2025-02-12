const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Concept Map Generator API',
      version: '1.0.0',
      description: 'API for generating concept maps using AI'
    },
    servers: [
      {
        url: 'http://localhost:3031',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        MapRequest: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              example: 'user123',
              description: 'ID del usuario'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Token JWT de autenticación'
            },
            theme: {
              type: 'string',
              example: 'Artificial Intelligence',
              description: 'Concept map theme'
            },
            considerations: {
              type: 'string',
              example: 'Include basic concepts and applications',
              description: 'Specific considerations for the map'
            }
          }
        },
        MapResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
              enum: ['success', 'error']
            },
            code: {
              type: 'string',
              example: 'MAP_GENERATED'
            },
            message: {
              type: 'string',
              example: 'Concept map generated successfully'
            },
            data: {
              type: 'object',
              properties: {
                map: {
                  type: 'string',
                  description: 'Mapa conceptual en formato GraphViz'
                },
                metadata: {
                  type: 'object',
                  properties: {
                    theme: {
                      type: 'string'
                    },
                    considerations: {
                      type: 'string'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time'
                    },
                    userId: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            code: {
              type: 'string',
              example: 'AUTH_INVALID_TOKEN'
            },
            message: {
              type: 'string',
              example: 'Authentication failed'
            },
            details: {
              type: 'object'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(swaggerOptions);
