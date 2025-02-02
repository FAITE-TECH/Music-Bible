import express from 'express';
import { getAllContacts, submitContactForm } from '../controllers/contact.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/submit',  submitContactForm);
router.get('/messages', getAllContacts);

export default router;
