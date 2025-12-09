/**
 * @swagger
 * tags:
 *   name: Codigo-Categoría
 *   description: Gestión de relaciones entre códigos y categorías
 */

import express from 'express';
import CodigoCategoriaController from '../Controllers/codigoCategoriaControllers.js';
import { createCodigoCategoriaValidator } from '../Validators/createCodigoCategoriaValidator.js';
import { validate } from "../Middleware/validateMiddleware.js";
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /codigos-categorias/add:
 *   post:
 *     summary: Agregar código a una categoría
 *     description: Asocia un código a una categoría específica
 *     tags: [Codigo-Categoría]
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
 *               - categoriaId
 *             properties:
 *               codigoId:
 *                 type: integer
 *                 example: 1
 *               categoriaId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Código agregado a categoría correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Código agregado a categoría correctamente"
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/add', authMiddleware, createCodigoCategoriaValidator, validate, CodigoCategoriaController.addCodigoToCategoria);

/**
 * @swagger
 * /codigos-categorias/remove:
 *   delete:
 *     summary: Remover código de una categoría
 *     description: Desasocia un código de una categoría específica
 *     tags: [Codigo-Categoría]
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
 *               - categoriaId
 *             properties:
 *               codigoId:
 *                 type: integer
 *                 example: 1
 *               categoriaId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Código removido de categoría correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Código removido de categoría correctamente"
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete('/remove', authMiddleware, CodigoCategoriaController.removeCodigoFromCategoria);

/**
 * @swagger
 * /codigos-categorias/codigo/{codigoId}:
 *   get:
 *     summary: Obtener categorías de un código
 *     description: Retorna todas las categorías asociadas a un código específico
 *     tags: [Codigo-Categoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del código
 *     responses:
 *       200:
 *         description: Categorías obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_categorias:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Código no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/codigo/:codigoId', authMiddleware, CodigoCategoriaController.getCategoriasFromCodigo);

/**
 * @swagger
 * /codigos-categorias/categoria/{categoriaId}:
 *   get:
 *     summary: Obtener códigos de una categoría
 *     description: Retorna todos los códigos asociados a una categoría específica
 *     tags: [Codigo-Categoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoriaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Códigos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titulo:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                       lenguaje:
 *                         type: string
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/categoria/:categoriaId', authMiddleware, CodigoCategoriaController.getCodigosFromCategoria);

export default router;
