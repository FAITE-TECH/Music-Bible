
import express from 'express';
import { createAlbum, getAlbum } from '../controllers/category.controller.js';

const router = express.Router();


router.post('/create', createAlbum);
router.get('/getAlbum', getAlbum);







export default router;