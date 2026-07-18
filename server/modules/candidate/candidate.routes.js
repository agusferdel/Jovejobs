import express from 'express';
import candidateController from './candidate.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { uploadImage } from "../../middlewares/multerSingle.js"
import authController from '../auth/auth.controller.js';


const router = express.Router();

router.put('/editUser', verifyToken, uploadImage('user'), candidateController.editCandidate);

router.put('/updateSearching', verifyToken,candidateController.updateSearching);

router.put('/updatePrivacy', verifyToken, candidateController.updatePrivacy);

router.put('/delCv', verifyToken,candidateController.deleteCv);

router.get('/public/:candidate_id', candidateController.candidateById);

router.get('/allCandidates', verifyToken, candidateController.getAllCandidates);

router.get('/adminGetCandidate/:candidate_id', verifyToken,authController.userById);

export default router;
