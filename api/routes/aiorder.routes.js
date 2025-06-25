import express from 'express';
import { deleteAIOrder, getAIOrders } from '../controllers/aiorder.controller.js';



const router = express.Router();

router.get('/getAIOrders',  getAIOrders);
router.delete('/deleteAIOrder/:orderId',  deleteAIOrder);

export default router;