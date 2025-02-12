const express = require('express');
const router = express.Router();
const mapGenController = require('../controllers/mapGenController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /map:
 *   get:
 *     summary: Generates a concept map using AI
 *     description: Generates a concept map in GraphViz format about a specific topic
 *     tags:
 *       - Concept Maps
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Authenticated user ID
 *         example: user123
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT Authentication token
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       - in: query
 *         name: theme
 *         required: true
 *         schema:
 *           type: string
 *         description: Concept map theme
 *         example: Artificial Intelligence
 *       - in: query
 *         name: considerations
 *         required: true
 *         schema:
 *           type: string
 *         description: Specific considerations for the map
 *         example: Include basic concepts and applications
 *     responses:
 *       200:
 *         description: Mapa conceptual generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MapResponse'
 *       400:
 *         description: Parámetros inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Error de autenticación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/map', verifyToken, mapGenController.generateMap);

module.exports = router;
