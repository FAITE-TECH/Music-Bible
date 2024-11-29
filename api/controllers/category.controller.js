import Category from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";


export const createAlbum = async (req, res, next) => {
  try {
     const { albumName , description  } = req.body;

    if (!albumName|| !description) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const slug = albumName.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newCategory = new Category({
      albumName,
      image: req.body.image || 'https://cdn.pixabay.com/photo/2018/07/01/20/01/music-3510326_1280.jpg',
      description
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};


export const getAlbum = async (req, res, next) => {
  try {
    const categories = await Category.find(); 
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};


