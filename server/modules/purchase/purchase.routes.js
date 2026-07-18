import express from 'express';
import purchaseController from './purchase.controller.js';

const router = express.Router();

router.get('/', purchaseController.getAllPurchases);

export default router;