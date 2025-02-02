
import express from 'express';

import { verifyToken } from '../utils/verifyUser.js';
import { createAlbum, getAlbum } from '../controllers/category.controller.js';

const router = express.Router();


router.post('/create', createAlbum);
router.get('/getAlbum', getAlbum);







export default router;