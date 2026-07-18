import { Router } from 'express';
import packController from './pack.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
const router = Router();

// Ruta para publica obtener todos los packs
router.get('/', packController.getPacks);

//Ruta Crear nuevo pack
router.post('/createPack', verifyToken, packController.createPack);

//Ruta Eliminar pack
// Ruta para el borrado lógico usando el controlador deletePack
router.put('/deletePack/:pack_id', verifyToken, packController.deletePack);

// Ruta protegida mediante token para realizar el cobro/actualización
router.put('/purchase', verifyToken, packController.purchasePack);

// Obtener un pack por ID
router.get('/:pack_id', packController.getPackById);

// Modificar un pack por ID (Protegido por token)
router.put('/editPack/:pack_id', verifyToken, packController.editPack);

export default router;
