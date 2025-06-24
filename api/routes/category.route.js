import express from 'express';
import { 
  createAlbum, 
  getAlbum, 
  deleteAlbum,
  updateAlbum,
  getAlbums,
  getAlbumById
} from '../controllers/category.controller.js';

const router = express.Router();

router.post('/create', createAlbum);
router.get('/getAlbum', getAlbum);
router.get('/getAlbums', getAlbums);
router.get('/getAlbum/:albumId', getAlbumById);
router.delete('/delete/:albumId/:userId',  deleteAlbum);
router.put('/update/:albumId/:userId', updateAlbum);

export default router;