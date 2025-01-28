require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const redis = require('redis');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3090;

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Chatbot API',
            version: '1.0.0',
            description: 'API para comunicarse con el chatbot de Gemini'
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    apis: ['./server.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(bodyParser.json());
app.use(cors());

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis', err);
});

// Conectar el cliente de Redis y luego iniciar el servidor
redisClient.connect().then(() => {
    console.log('Conectado a Redis');

    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}).catch(console.error);

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @swagger
 * /mapgenerator:
 *   post:
 *     summary: Enviar un mensaje al chatbot
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "user123"
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           example: "jwt-token"
 *       - in: query
 *         name: theme
 *         required: true
 *         schema:
 *           type: string
 *           example: "technology"
 *       - in: query
 *         name: considerations
 *         required: true
 *         schema:
 *           type: string
 *           example: "be concise"
 *     responses:
 *       200:
 *         description: Respuesta del chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 botMessage:
 *                   type: string
 *                   example: "Hola, estoy bien. ¿Y tú?"
 *                 description:
 *                   type: string
 *                   example: "Mensaje recibido y procesado correctamente."
 *       400:
 *         description: userId, token, theme y considerations son requeridos
 *       401:
 *         description: Token inválido o Token JWT inválido
 *       500:
 *         description: Error al comunicarse con el chatbot o Error al acceder a Redis
 */
app.post('/mapgenerator', async (req, res) => {
    const { userId, token, theme, considerations } = req.query;

    console.log('Solicitud recibida:', { userId, token, theme, considerations });

    if (!userId || !token || !theme || !considerations) {
        console.log('userId, token, theme o considerations faltante');
        return res.status(400).json({ error: 'userId, token, theme y considerations son requeridos' });
    }

    try {
        const storedToken = await redisClient.get(userId);

        console.log('Token almacenado en Redis:', storedToken);

        if (storedToken !== token) {
            console.log('Token inválido');
            return res.status(401).json({ error: 'Token inválido' });
        }

        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log('Token JWT inválido:', err);
                return res.status(401).json({ error: 'Token JWT inválido', details: err.message });
            }

            console.log('Token JWT verificado:', decoded);

            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
                let prompt = `Genera un mapa conceptual en formato graphviz sobre ${theme}, asegurándote de incluir ${considerations}. Organiza la información en temas y subtemas. El resultado debe ser exclusivamente el mapa conceptual en graphviz, sin texto adicional.`;
                console.log('Prompt generado:', prompt);
                
                // Enviar la petición a Gemini
                const result = await model.generateContent(prompt);
                const botMessage = await result.response.text();

                console.log('Respuesta del bot:', botMessage);

                // Guardar la respuesta en un archivo JSON
                const response = { 
                    botMessage: botMessage,
                    description: 'Mensaje recibido y procesado correctamente.'
                };
                fs.writeFileSync('response.json', JSON.stringify(response, null, 2));

                res.json(response);
            } catch (error) {
                console.error('Error al comunicarse con el chatbot:', error);
                res.status(500).json({ 
                    error: 'Error al comunicarse con el chatbot',
                    details: error.message
                });
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ 
            error: 'Error al procesar la solicitud',
            details: error.message
        });
    }
});
