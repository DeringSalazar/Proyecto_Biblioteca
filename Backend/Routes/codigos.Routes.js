import express from 'express';
import CodigosController from '../Controllers/codigosControllers.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/codigos:
 *   post:
 *     summary: Crear nuevo código
 *     description: |\n       Crea un nuevo fragmento de código en la biblioteca personal.\n       Campos requeridos: titulo, codigo, lenguaje\n       Los tags ayudan a clasificar y buscar códigos
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
 *                 example: "Función Suma"
 *                 description: Nombre corto del código (máx 200 caracteres)
 *               descripcion:
 *                 type: string
 *                 example: "Suma dos números"
 *                 description: Explicación del propósito del código
 *               codigo:
 *                 type: string
 *                 example: "function suma(a, b) { return a + b; }"
 *                 description: Contenido del código fuente
 *               lenguaje:
 *                 type: string
 *                 example: "JavaScript"
 *                 description: Lenguaje de programación (JavaScript, Python, Java, etc)
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "math", "basico"]
 *                 description: Etiquetas para clasificación y búsqueda
 *               tipo:
 *                 type: string
 *                 example: "function"
 *                 description: Tipo de código (function, snippet, algorithm, error-fix, etc)
 *     responses:
 *       201:
 *         description: Código creado exitosamente
 *       400:
 *         description: Campos requeridos faltantes (titulo, codigo, lenguaje)
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, CodigosController.createCodigo.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/my:
 *   get:
 *     summary: Obtener mis códigos
 *     description: |\n       Retorna todos los fragmentos de código creados por el usuario autenticado.\n       Útil para administrar y organizar tu biblioteca personal de códigos.
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
 * /api/codigos/tags/{tag}:
 *   get:
 *     summary: Obtener códigos por etiqueta
 *     description: |\n       Busca y retorna todos los códigos que contengan la etiqueta especificada.\n       Endpoint público (sin autenticación) para descubrir códigos por categoría.
 *     tags:
 *       - Codigos
 *     parameters:
 *       - name: tag
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "javascript"
 *         description: Etiqueta a buscar
 *     responses:
 *       200:
 *         description: Códigos encontrados exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/tags/:tag', CodigosController.getCodigosByTag.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/{id}:
 *   get:
 *     summary: Obtener código por ID
 *     description: |\n       Obtiene un fragmento de código específico con su contenido completo.\n       Solo el autor del código o un admin pueden verlo.
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
 *         description: ID del código
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
 * /api/codigos/{id}:
 *   put:
 *     summary: Actualizar código
 *     description: |\n       Actualiza los datos de un código existente.\n       Solo el autor del código o un admin pueden modificarlo.\n       Puedes actualizar parcialmente (no necesitas enviar todos los campos).
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
 *         description: ID del código a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Función Suma Mejorada"
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
 *         description: Código actualizado exitosamente
 *       404:
 *         description: Código no encontrado
 *       403:
 *         description: Solo el autor puede modificar este código
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, CodigosController.updateCodigo.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/{id}:
 *   delete:
 *     summary: Eliminar código
 *     description: |\n       Elimina permanentemente un fragmento de código.\n       Solo el autor del código o un admin pueden eliminarlo.\n       Nota: El código se elimina automáticamente de todas las colecciones.
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
 *         description: ID del código a eliminar
 *     responses:
 *       200:
 *         description: Código eliminado exitosamente
 *       404:
 *         description: Código no encontrado
 *       403:
 *         description: Solo el autor puede eliminar este código
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, CodigosController.deleteCodigo.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/colecciones/add:
 *   post:
 *     summary: Agregar código a colección
 *     description: |\n       Agrega un fragmento de código existente a una colección (relación N:N).\n       El usuario debe ser propietario de la colección.\n       Si el código ya existe en la colección, se actualiza la fecha.
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
 *                 description: ID del código a agregar
 *               coleccionId:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la colección
 *     responses:
 *       200:
 *         description: Código agregado a la colección exitosamente
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
 * /api/codigos/colecciones/remove:
 *   post:
 *     summary: Remover código de colección
 *     description: |\n       Elimina un fragmento de código de una colección específica (relación N:N).\n       El usuario debe ser propietario de la colección.\n       El código en sí no se elimina, solo la relación con la colección.
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
 *                 description: ID del código a remover
 *               coleccionId:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la colección
 *     responses:
 *       200:
 *         description: Código removido de la colección exitosamente
 *       404:
 *         description: Código o colección no encontrado
 *       403:
 *         description: Acceso denegado
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.post('/colecciones/remove', authMiddleware, CodigosController.removeCodigoFromColeccion.bind(CodigosController));

/**
 * @swagger
 * /api/codigos/{id}/colecciones:
 *   get:
 *     summary: Obtener colecciones de un código
 *     description: |\n       Retorna todas las colecciones que contienen un fragmento de código específico.\n       Solo el autor del código o un admin pueden ver a qué colecciones pertenece.\n       Útil para consultar en qué colecciones se ha organizado un código.
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
 *         description: ID del código
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
