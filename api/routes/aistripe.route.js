import express from 'express';
import { createAISession, handleAIWebhook } from '../controllers/aistripe.controller.js';

const router = express.Router();

router.post('/create-ai-checkout-session', createAISession);
router.post('/ai-webhook', express.raw({ type: 'application/json' }), handleAIWebhook);

export default router;