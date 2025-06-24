import Category from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";


export const createAlbum = async (req, res, next) => {
  try {
    const { albumName, description, image } = req.body;

    // Validate description after stripping HTML tags
    const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
    
    if (!albumName || !cleanDescription) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const slug = albumName.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    
    const newCategory = new Category({
      albumName,
      slug,
      image: image || 'https://cdn.pixabay.com/photo/2018/07/01/20/01/music-3510326_1280.jpg',
      description: cleanDescription
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


