import express from 'express';
import workdayTypeController from './workdayType.controller.js';
import { verifyToken } from '../../../middlewares/verifyToken.js';

const router = express.Router();

//rutas para tipo de contrato

//ruta para nuevo tipo de contrato
router.post('/workdayTypes', verifyToken, workdayTypeController.createWorkdayType);

//ruta para obtener todos los tipos de contrato
router.get('/workdayTypes', workdayTypeController.getAllWorkdayTypes);

//ruta para editar tipo de contrato
router.put('/update/:id', verifyToken, workdayTypeController.updateWorkdayType);

//ruta para eliminar tipo de contrato
router.delete('/delete/:id', verifyToken, workdayTypeController.deleteWorkdayType);

export default router;
