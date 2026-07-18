import express from 'express';
import offerTypeController from './offerType.controller.js';
import { verifyToken } from '../../../middlewares/verifyToken.js';

const router = express.Router();

//rutas para tipo de contrato

//ruta para nuevo tipo de contrato
router.post('/offerTypes', verifyToken, offerTypeController.createOfferType);

//ruta para obtener todos los tipos de contrato
router.get('/offerTypes', offerTypeController.getAllOfferTypes);

//ruta para editar tipo de contrato
router.put('/update/:id', verifyToken, offerTypeController.updateOfferType);

//ruta para eliminar tipo de contrato
router.delete('/delete/:id', verifyToken, offerTypeController.deleteOfferType);

export default router;
