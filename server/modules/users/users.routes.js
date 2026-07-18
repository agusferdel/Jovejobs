import express from 'express';
import usersController from './users.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// Ruta para cambiar contraseña de todos los usuarios
router.put('/changePassword', verifyToken, usersController.changePassword);

//ruta para que un usuario elimine su cuenta
router.put('/delete', verifyToken, usersController.autoDelete);

//ruta para eliminar un usuario desde el admin
router.put('/delete/:user_id', verifyToken, usersController.autoDelete);

//ruta para eliminar un usuario
router.put('/restore/:user_id', verifyToken, usersController.restoreUser);

//ruta para desabilitar un usuario desde el admin
router.put('/disabled/:user_id', verifyToken, usersController.disabledUser);

//ruta para habilitar un usuario
router.put('/enabled/:user_id', verifyToken, usersController.enabledUser);

export default router;
