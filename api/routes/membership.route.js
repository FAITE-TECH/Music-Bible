import express from 'express';
import { createMembership, getAllMembership } from '../controllers/membership.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { acceptMembership, rejectMembership } from '../controllers/membership.controller.js';




const router = express.Router();

router.post('/create',  createMembership);
router.get('/membership', getAllMembership); 
router.put('/accept/:membershipId', acceptMembership);
router.put('/reject/:membershipId',  rejectMembership);



export default router;