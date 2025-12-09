import express from 'express';
import CodigosController from '../Controllers/codigosControllers.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { createCodigoValidator } from "../Validators/createCodigoValidator.js";
import { updateCodigoValidator } from "../Validators/updateCodigoValidator.js";
import { validate } from "../Middleware/validateMiddleware.js";
import { allowRoles } from '../Middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   x-internal: true
 * info:
 * tags:
 *   name: Codigos
 *   description: Endpoints para gestionar Codigos
 * paths:
 *   /codigos:
 *     post:
 *       summary: Crear nuevo código  (solo admin)
 *       description: Crea un nuevo fragmento de código en la biblioteca personal
 *       tags:
 *         - Codigos
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - titulo
 *                 - codigo
 *                 - lenguaje
 *               properties:
 *                 titulo:
 *                   type: string
 *                   example: "Función Suma"
 *                 descripcion:
 *                   type: string
 *                   example: "Suma dos números"
 *                 codigo:
 *                   type: string
 *                   example: "function suma(a, b) { return a + b; }"
 *                 lenguaje:
 *                   type: string
 *                   example: "JavaScript"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["javascript", "math"]
 *                 tipo:
 *                   type: string
 *                   example: "function"
 *       responses:
 *         '201':
 *           description: Código creado exitosamente
 *         '400':
 *           description: Campos requeridos faltantes
 *         '401':
 *           description: Token inválido o expirado
 *         '500':
 *           description: Error del servidor
 */
router.post('/', authMiddleware, allowRoles('admin'), createCodigoValidator, validate, CodigosController.createCodigo.bind(CodigosController));

/**
 * @swagger
 * /codigos/my:
 *   get:
 *     summary: Obtener mis códigos
 *     description: Retorna todos los códigos creados por el usuario autenticado
 *     tags:
 *       - Codigos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Códigos obtenidos exitosamente
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.get('/my', authMiddleware, CodigosController.getMyCodeos.bind(CodigosController));

/**
 * @swagger
 * /codigos/tags/{tag}:
 *   get:
 *     summary: Obtener códigos por etiqueta
 *     description: Busca códigos por etiqueta (endpoint público)
 *     tags:
 *       - Codigos
 *     parameters:
 *       - name: tag
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: javascript
 *     responses:
 *       200:
 *         description: Códigos encontrados
 *       500:
 *         description: Error del servidor
 */
router.get('/tags/:tag', CodigosController.getCodigosByTag.bind(CodigosController));

/**
 * @swagger
 * /codigos/{id}:
 *   get:
 *     summary: Obtener código por ID
 *     description: Obtiene un fragmento de código específico
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
 *         example: 1
 *     responses:
 *       200:
 *         description: Código obtenido exitosamente
 *       404:
 *         description: Código no encontrado
 *       403:
 *         description: Acceso denegado
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, CodigosController.getCodigoById.bind(CodigosController));

/**
 * @swagger
 * /codigos/{id}:
 *   put:
 *     summary: Actualizar código
 *     description: Actualiza los datos de un código existente
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
 *         example: 1
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
 *                 example: ["javascript", "math"]
 *               tipo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código actualizado exitosamente
 *       404:
 *         description: Código no encontrado
 *       403:
 *         description: Solo el autor puede modificar
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id',  authMiddleware, updateCodigoValidator, validate, CodigosController.updateCodigo.bind(CodigosController));

/**
 * @swagger
 * /codigos/{id}:
 *   delete:
 *     summary: Eliminar código
 *     description: Elimina permanentemente un fragmento de código
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
 *         example: 1
 *     responses:
 *       200:
 *         description: Código eliminado exitosamente
 *       404:
 *         description: Código no encontrado
 *       403:
 *         description: Solo el autor puede eliminar
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, CodigosController.deleteCodigo.bind(CodigosController));

/**
 * @swagger
 * /codigos/colecciones/add:
 *   post:
 *     summary: Agregar código a colección
 *     description: Agrega un código a una colección (relación N:N)
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
 *                 example: 1
 *               coleccionId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Código agregado a colección exitosamente
 *       404:
 *         description: Código o colección no encontrado
 *       403:
 *         description: Acceso denegado
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.post('/colecciones/add', authMiddleware, CodigosController.addCodigoToColeccion.bind(CodigosController));

/**
 * @swagger
 * /codigos/{id}/colecciones:
 *   get:
 *     summary: Obtener colecciones de un código
 *     description: Retorna todas las colecciones que contienen un código
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
 *         example: 1
 *     responses:
 *       200:
 *         description: Colecciones obtenidas exitosamente
 *       404:
 *         description: Código no encontrado
 *       403:
 *         description: Acceso denegado
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id/colecciones', authMiddleware, CodigosController.getColeccionesByCodigoId.bind(CodigosController));

export default router;
