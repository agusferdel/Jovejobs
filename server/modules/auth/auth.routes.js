import express from 'express';
import authController from './auth.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post('/login', authController.login);
router.get('/userById', verifyToken, authController.userById);

router.post('/registerCandidate', authController.register);
router.post('/registerCompany', authController.register);
router.get('/activate/:token', authController.activateUser);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

export default router;
