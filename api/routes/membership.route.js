import express from 'express';
import { createMembership, getAllMembership } from '../controllers/membership.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { acceptMembership, rejectMembership } from '../controllers/membership.controller.js';




const router = express.Router();

router.post('/create', verifyToken, createMembership);
router.get('/membership', getAllMembership); 
router.put('/accept/:membershipId', verifyToken, acceptMembership);
router.put('/reject/:membershipId', verifyToken, rejectMembership);



export default router;