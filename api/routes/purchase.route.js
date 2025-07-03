import express from 'express';
import { deleteMusicPurchase, getMusicPurchases, getUserPurchases } from '../controllers/purchase.controller.js';


const router = express.Router();

router.get('/getMusicPurchases', getMusicPurchases);
router.delete('/deleteMusicPurchase/:orderId', deleteMusicPurchase);
router.get('/getUserPurchases/:userId', getUserPurchases);

export default router;