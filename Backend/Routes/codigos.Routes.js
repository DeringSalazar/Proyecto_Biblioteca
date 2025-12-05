import express from 'express';
import CodigosController from '../Controllers/codigosControllers.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/codigos:
 *   post:
 *     summary: Create a new code
 *     description: Allows a user to save a new code fragment in their personal library
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - codigo
 *               - lenguaje
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Short name describing what the code does
 *               descripcion:
 *                 type: string
 *                 description: Brief explanation of the code's purpose
 *               codigo:
 *                 type: string
 *                 description: The actual code content
 *               lenguaje:
 *                 type: string
 *                 description: Programming language
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tags for classification
 *               tipo:
 *                 type: string
 *                 description: Optional type (snippet, function, error resolution, project, etc)
 *     responses:
 *       201:
 *         description: Code created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, CodigosController.createCodigo.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/my:
 *   get:
 *     summary: Get user's codes
 *     description: Returns all code fragments created by the current user
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Codes obtained successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my', authMiddleware, CodigosController.getMyCodeos.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/tags/{tag}:
 *   get:
 *     summary: Get codes by tag
 *     description: Obtains a code fragment by tag
 *     tags:
 *       - Codigos
 *     parameters:
 *       - name: tag
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Codes obtained successfully
 *       500:
 *         description: Server error
 */
router.get('/tags/:tag', CodigosController.getCodigosByTag.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/{id}:
 *   get:
 *     summary: Get code by ID
 *     description: Obtains a specific code fragment, displaying its complete content
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Code obtained successfully
 *       404:
 *         description: Code not found
 *       403:
 *         description: Access denied
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, CodigosController.getCodigoById.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/{id}:
 *   put:
 *     summary: Update code
 *     description: Only the author can modify the code
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               codigo:
 *                 type: string
 *               lenguaje:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code updated successfully
 *       404:
 *         description: Code not found
 *       403:
 *         description: Only the author can modify this code
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, CodigosController.updateCodigo.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/{id}:
 *   delete:
 *     summary: Delete code
 *     description: Permanently deletes a code fragment
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Code deleted successfully
 *       404:
 *         description: Code not found
 *       403:
 *         description: Only the author can delete this code
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, CodigosController.deleteCodigo.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/colecciones/add:
 *   post:
 *     summary: Add code to collection
 *     description: Adds a code fragment to a collection
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigoId
 *               - coleccionId
 *             properties:
 *               codigoId:
 *                 type: integer
 *               coleccionId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Code added to collection successfully
 *       404:
 *         description: Code or collection not found
 *       403:
 *         description: Access denied
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/colecciones/add', authMiddleware, CodigosController.addCodigoToColeccion.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/colecciones/remove:
 *   post:
 *     summary: Remove code from collection
 *     description: Removes a code fragment from a collection
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigoId
 *               - coleccionId
 *             properties:
 *               codigoId:
 *                 type: integer
 *               coleccionId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Code removed from collection successfully
 *       404:
 *         description: Code or collection not found
 *       403:
 *         description: Access denied
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/colecciones/remove', authMiddleware, CodigosController.removeCodigoFromColeccion.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/{id}/colecciones:
 *   get:
 *     summary: Get collections by code ID
 *     description: Returns all collections that contain a specific code
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Collections obtained successfully
 *       404:
 *         description: Code not found
 *       403:
 *         description: Access denied
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id/colecciones', authMiddleware, CodigosController.getColeccionesByCodigoId.bind(CodigosController));

export default router;
