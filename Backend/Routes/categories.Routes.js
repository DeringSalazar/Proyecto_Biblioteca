import { Router } from 'express';
import categoriesController from '../Controllers/categoriesControllers.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = Router();
import { createCategoriesValidator } from '../Validators/createCategoriesValidator.js';
import { updateCategoriesValidator } from '../Validators/updateCategoriesValidator.js';
import { validate } from '../Middleware/validateMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints para gestionar categorías
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *           enum: [activo, inactivo]
 *
 *     CreateCategory:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *         - estado
 *       properties:
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *           enum: [activo, inactivo]
 *
 *     UpdateCategory:
 *       type: object
 *       required:
 *         - id
 *         - nombre
 *         - descripcion
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *           enum: [activo, inactivo]
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
 * /categories:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error interno del servidor al obtener las categorías.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/',categoriesController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtiene una categoría según su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 categories:
 *                   $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error interno del servidor al obtener la categoría por ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', categoriesController.getCategories);

/**
 * @swagger
 * /categories/code/{id}:
 *   get:
 *     summary: Obtiene una categoría por su código
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada por código.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 categories:
 *                   $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error interno del servidor al obtener la categoría por código.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/code/:id', categoriesController.getCategoriesByCode);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Faltan datos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: La categoría ya existe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor al crear la categoría.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/',authMiddleware, createCategoriesValidator, validate,categoriesController.createCategories);

/**
 * @swagger
 * /categories:
 *   put:
 *     summary: Actualiza una categoría
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Faltan datos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Duplicado detectado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor al actualizar la categoría.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/',authMiddleware, updateCategoriesValidator, validate, categoriesController.updateCategories);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor al eliminar la categoría.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', categoriesController.deleteCategories);

export default router;