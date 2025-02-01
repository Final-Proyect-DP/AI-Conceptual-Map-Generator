const express = require('express');
const router = express.Router();
const mapGenController = require('../controllers/mapGenController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /map:
 *   get:
 *     summary: Genera un mapa conceptual usando IA
 *     description: Genera un mapa conceptual en formato GraphViz sobre un tema específico
 *     tags:
 *       - Mapas Conceptuales
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario autenticado
 *         example: user123
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT de autenticación
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       - in: query
 *         name: theme
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema del mapa conceptual
 *         example: Inteligencia Artificial
 *       - in: query
 *         name: considerations
 *         required: true
 *         schema:
 *           type: string
 *         description: Consideraciones específicas para el mapa
 *         example: Incluir conceptos básicos y aplicaciones
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
