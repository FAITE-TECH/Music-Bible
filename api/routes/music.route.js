import express from 'express';
import { createMusic, deleteMusic, getAllMusic,  getMusicByCategory, getMusicById, updateMusic } from '../controllers/music.control.js';



const router = express.Router();


router.post('/create',  createMusic);
router.put('/update/:musicId/:userId',  updateMusic);
router.delete('/delete/:musicId/:userId',  deleteMusic);
router.get('/category', getMusicByCategory);
router.get('/music', getAllMusic); 
router.get('/getmusic/:musicId', getMusicById);
router.get('/category', getMusicByCategory);





export default router;
