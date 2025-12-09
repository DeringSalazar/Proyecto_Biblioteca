import { Router } from 'express';
import subscriptionsController from '../Controllers/subscriptionsControllers.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { createSuscripcionesValidator } from '../Validators/createSuscripcionesValidator.js';
import { updateSuscripcionesValidator } from '../Validators/updateSuscripcionesValidator.js';  
import { validate } from "../Middleware/validateMiddleware.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Endpoints para gestionar suscripciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Suscripcion:
 *       type: object
 *       properties:
 *         id_suscripciones:
 *           type: integer
 *           description: ID autogenerado de la suscripción
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario asociado
 *         id_categoria:
 *           type: integer
 *           description: ID de la categoría suscrita
 *         fecha_suscripcion:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación
 *         notificaciones:
 *           type: boolean
 *           description: Estado de las notificaciones
 *
 *     CreateSuscripcion:
 *       type: object
 *       required:
 *         - id_usuario
 *         - id_categoria
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario a suscribir
 *         id_categoria:
 *           type: integer
 *           description: ID de la categoría
 *         notificaciones:
 *           type: boolean
 *           default: true
 *           description: Opcional. Define si las notificaciones están activas
 *
 *     UpdateSuscripcion:
 *       type: object
 *       required:
 *         - id_suscripciones
 *         - notificaciones
 *       properties:
 *         id_suscripciones:
 *           type: integer
 *           description: ID de la suscripción a actualizar
 *         notificaciones:
 *           type: boolean
 *           description: Nuevo estado de las notificaciones
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
 * /subscriptions/user/{id}:
 *   get:
 *     summary: Obtener la suscripción de un usuario
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Suscripción obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 subscription:
 *                   $ref: '#/components/schemas/Suscripcion'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/user/:id', subscriptionsController.getSubscriptionByUser);

/**
 * @swagger
 * /subscriptions/{id}:
 *   get:
 *     summary: Obtener una suscripción por su ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la suscripción
 *     responses:
 *       200:
 *         description: Suscripción obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 subscription:
 *                   $ref: '#/components/schemas/Suscripcion'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', subscriptionsController.getSubscriptionById);

/**
 * @swagger
 * /subscriptions/feed/user/{id}:
 *   get:
 *     summary: Obtener el feed basado en las suscripciones de un usuario
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Feed obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 feed:
 *                   type: object
 *       500:
 *         description: Error interno del servidor
 */
router.get('/feed/user/:id', subscriptionsController.getFeedByUser);

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Crear una nueva suscripción
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSuscripcion'
 *     responses:
 *       201:
 *         description: Suscripción creada correctamente
 *       400:
 *         description: Datos faltantes
 *       409:
 *         description: La categoría ya existe para este usuario
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authMiddleware,  createSuscripcionesValidator, validate, subscriptionsController.createSubscription);

/**
 * @swagger
 * /subscriptions:
 *   put:
 *     summary: Actualizar una suscripción
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de la suscripción
 *               notificaciones:
 *                 type: boolean
 *                 description: Nuevo valor del estado de notificaciones
 *     responses:
 *       200:
 *         description: Suscripción actualizada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.put('/', authMiddleware, updateSuscripcionesValidator, validate, subscriptionsController.updateSubscription);

/**
 * @swagger
 * /subscriptions/{id}:
 *   delete:
 *     summary: Eliminar una suscripción
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la suscripción
 *     responses:
 *       200:
 *         description: Suscripción eliminada correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', subscriptionsController.deleteSubscription);

export default router;