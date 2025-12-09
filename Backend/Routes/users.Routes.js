import express from 'express';
import rateLimit from 'express-rate-limit';
import { logEvent } from '../utils/logger.js';
import UsersController from '../Controllers/usersControllers.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { allowRoles } from '../Middleware/roleMiddleware.js';
import { createUserValidation } from '../Validators/createUserValidator.js'; 
import { createLoginValidator } from '../Validators/createLoginValidator.js';
import { updateUserValidator } from '../Validators/updateUserValidator.js';
import { validate } from '../Middleware/validateMiddleware.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: {
    error: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 1 minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *         nombre_completo:
 *           type: string
 *         email:
 *           type: string
 *         fecha_creacion:
 *           type: string
 *         rol:
 *           type: string
 *           enum: [admin, usuario]
 *
 *     RegisterUser:
 *       type: object
 *       required:
 *         - nombre_completo
 *         - email
 *         - contrasena
 *       properties:
 *         nombre_completo:
 *           type: string
 *           example: Marcos Herrera M.
 *         email:
 *           type: string
 *           example: mherrera@utn.cr
 *         contrasena:
 *           type: string
 *           format: password
 *           example: ""
 *         rol:
 *           type: string
 *           enum: 
 *              - usuario
 *              - admin
 * 
 *     LoginUser:
 *       type: object
 *       required:
 *         - email
 *         - contrasena
 *       properties:
 *         email:
 *           type: string
 *         contrasena:
 *           type: string
 *
 *     UpdateUser:
 *       type: object
 *       properties:
 *         nombre_completo:
 *           type: string
 *         email:
 *           type: string
 *         contrasena:
 *           type: string
 *         rol:
 *           type: string
 *           enum: [admin, usuario]
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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos faltantes
 *       409:
 *         description: Email ya registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', createUserValidation, validate, UsersController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Inicia sesión y genera un token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', loginLimiter, createLoginValidator, validate, UsersController.login);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Busca usuarios por nombre o email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Texto a buscar
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/search', authMiddleware, UsersController.search);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: Token inválido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/me', authMiddleware, UsersController.getProfile);


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acción prohibida
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Email duplicado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', authMiddleware, allowRoles('admin'), updateUserValidator, validate, UsersController.updateProfile
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores pueden eliminar usuarios
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, allowRoles('admin'), UsersController.deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos los usuarios (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores pueden entrar
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, allowRoles('admin'), UsersController.listAll);

export default router;
