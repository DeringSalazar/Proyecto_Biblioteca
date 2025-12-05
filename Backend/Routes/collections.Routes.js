import { Router } from "express";
import CollectionsController from "../Controllers/collectionsControllers.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: Endpoints para gestionar colecciones de snippets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *
 *     CreateCollection:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *
 *     UpdateCollection:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *
 *     Snippet:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         titulo:
 *           type: string
 *         contenido:
 *           type: string
 *         lenguaje:
 *           type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         error:
 *           type: string
 */
router.use(authMiddleware);

/**
 * @swagger
 * /collections:
 *   get:
 *     summary: Obtiene las colecciones del usuario autenticado
 *     tags: [Collections]
 *     responses:
 *       200:
 *         description: Lista de colecciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 collections:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Collection'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", CollectionsController.getMyCollections);

/**
 * @swagger
 * /collections:
 *   post:
 *     summary: Crea una nueva colección
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCollection'
 *     responses:
 *       201:
 *         description: Colección creada correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", CollectionsController.createCollection);

/**
 * @swagger
 * /collections/{id}:
 *   get:
 *     summary: Obtiene una colección por ID
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la colección
 *     responses:
 *       200:
 *         description: Colección encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       404:
 *         description: Colección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", CollectionsController.getCollectionById);

/**
 * @swagger
 * /collections/{id}:
 *   put:
 *     summary: Actualiza una colección
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCollection'
 *     responses:
 *       200:
 *         description: Colección actualizada correctamente
 *       404:
 *         description: Colección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", CollectionsController.updateCollection);

/**
 * @swagger
 * /collections/{id}:
 *   delete:
 *     summary: Elimina una colección
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Colección eliminada correctamente
 *       404:
 *         description: Colección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", CollectionsController.deleteCollection);

/**
 * @swagger
 * /collections/{id}/snippets:
 *   get:
 *     summary: Obtiene los snippets de una colección
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Snippets obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Snippet'
 *       404:
 *         description: Colección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id/snippets", CollectionsController.getSnippetsByCollection);

/**
 * @swagger
 * /collections/{id}/snippets:
 *   post:
 *     summary: Agrega un snippet a una colección
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               snippet_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Snippet agregado a la colección
 *       404:
 *         description: Colección o snippet no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/:id/snippets", CollectionsController.addSnippetToCollection);

/**
 * @swagger
 * /collections/{id}/snippets/{snippet_id}:
 *   delete:
 *     summary: Elimina un snippet de una colección
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: snippet_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Snippet eliminado de la colección
 *       404:
 *         description: Colección o snippet no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  "/:id/snippets/:snippet_id",
  CollectionsController.removeSnippetFromCollection
);

export default router;
