import express from 'express';
import provinceController from './province.controller.js';

const router = express.Router();

router.get('/province', provinceController.provinceSearch);

export default router;