import express from 'express';
<<<<<<< HEAD
import { verifyToken } from '../utils/verifyUser.js';
=======
>>>>>>> 4c92959 (new)
import { toggleFavorite, getFavorites } from '../controllers/favorite.controller.js';

const router = express.Router();

<<<<<<< HEAD
router.post('/toggle/:musicId', verifyToken, toggleFavorite);
router.get('/', verifyToken, getFavorites);
=======
router.post('/toggle/:musicId', toggleFavorite);
router.get('/',  getFavorites);
>>>>>>> 4c92959 (new)

export default router;