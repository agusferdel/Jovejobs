import express from 'express';
import languageController from './language.controller.js';
import { verifyToken } from '../../../middlewares/verifyToken.js';





const router = express.Router();


router.post('/newLanguage',verifyToken, languageController.newLanguage);

router.get('/myLanguages', verifyToken, languageController.getLanguages);

router.put('/editLanguage/:language_id', verifyToken,languageController.editLanguage);

router.delete('/delLanguage/:language_id', verifyToken, languageController.deleteLanguage);


export default router;
