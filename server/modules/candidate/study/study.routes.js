import express from 'express';
import { verifyToken } from '../../../middlewares/verifyToken.js';
import { uploadImage } from '../../../middlewares/multerSingle.js';
import studyController from './study.controller.js';




const router = express.Router();

router.post('/newStudy', verifyToken, uploadImage("certificates"),studyController.newStudy );

router.get('/myStudies', verifyToken, studyController.getStudies);

router.put('/editStudy/:study_id', verifyToken, uploadImage("certificates"), studyController.editStudy);

router.delete('/delStudy/:study_id',verifyToken,studyController.deleteStudy);



export default router;