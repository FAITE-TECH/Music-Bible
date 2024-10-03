import express from 'express';
import { createMusic, deleteMusic, getAllMusic,  getMusicByCategory, getMusicById, updateMusic } from '../controllers/music.control.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();


router.post('/create', verifyToken, createMusic);
router.put('/update/:musicId/:userId', verifyToken, updateMusic);
router.delete('/delete/:musicId/:userId', verifyToken, deleteMusic);
router.get('/category', getMusicByCategory);
router.get('/music', getAllMusic); 
router.get('/getmusic/:musicId', getMusicById);
router.get('/category', getMusicByCategory);





export default router;
