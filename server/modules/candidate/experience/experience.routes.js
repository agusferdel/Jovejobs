import express from 'express';
import { verifyToken } from '../../../middlewares/verifyToken.js';
import experienceController from './experience.controller.js';



const router = express.Router();


router.post('/newExperience', verifyToken , experienceController.newExperience);

router.get('/myExperience', verifyToken, experienceController.getExperience);

router.put('/editExp/:experience_id',verifyToken, experienceController.editExperience);

router.delete('/delExperience/:experience_id',verifyToken, experienceController.deleteExperience)

export default router;
