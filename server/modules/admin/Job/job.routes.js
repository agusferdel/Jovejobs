import express from 'express';
import JobController from './job.controller.js';
import { verifyToken } from '../../../middlewares/verifyToken.js';

const router = express.Router();

//rutas para tipo de area /tabla job

//ruta para nueva area
router.post('/jobs', verifyToken, JobController.createJob);

//ruta para obtener todos los tipos de area
router.get('/jobs', verifyToken, JobController.getAllJobs);

//ruta para editar area
router.put('/update/:id', verifyToken, JobController.updateJob);

//ruta para eliminar area
router.delete('/delete/:id', verifyToken, JobController.deleteJob);

export default router;
