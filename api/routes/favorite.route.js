import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { toggleFavorite, getFavorites } from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/toggle/:musicId', verifyToken, toggleFavorite);
router.get('/', verifyToken, getFavorites);

export default router;