// Backend/Routes/users.Routes.js
import express from 'express';
import UsersController from '../Controllers/usersControllers.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { allowRoles } from '../Middleware/roleMiddleware.js';

const router = express.Router();


router.post('/', UsersController.register);


router.post('/login', UsersController.login);

router.get('/search', authMiddleware, UsersController.search);


router.get('/me', authMiddleware, UsersController.getProfile);

router.get('/:id', authMiddleware, UsersController.getProfile);

router.put('/:id', authMiddleware, UsersController.updateProfile);


router.delete('/:id', authMiddleware, allowRoles('admin'), UsersController.deleteUser);


router.get('/', authMiddleware, allowRoles('admin'), UsersController.listAll);

export default router;
