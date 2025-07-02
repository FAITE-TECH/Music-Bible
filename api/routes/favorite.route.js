import express from 'express';
import { toggleFavorite, getFavorites } from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/toggle/:musicId', toggleFavorite);
router.post('/',  getFavorites);

export default router;