import express from 'express';
import cityController from './city.controller.js';

const router = express.Router();

router.get('/cities-by-province/:province_id', cityController.citySearch);
router.get('/city/:city_id', cityController.getCityById);

export default router;