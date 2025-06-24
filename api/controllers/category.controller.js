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

export const getAlbums = async (req, res, next) => {
  try {
    const { searchTerm, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { albumName: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    const albums = await Category.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ updatedAt: -1 });

    const totalAlbums = await Category.countDocuments(query);
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    const lastMonthAlbums = await Category.countDocuments({
      ...query,
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      albums,
      totalAlbums,
      lastMonthAlbums,
      totalPages: Math.ceil(totalAlbums / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const album = await Category.findById(req.params.albumId);
    if (!album) {
      return next(errorHandler(404, 'Album not found'));
    }
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const album = await Category.findById(req.params.albumId);
    if (!album) {
      return next(errorHandler(404, 'Album not found'));
    }

    

    await Category.findByIdAndDelete(req.params.albumId);
    res.status(200).json('Album has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const album = await Category.findById(req.params.albumId);
    if (!album) {
      return next(errorHandler(404, 'Album not found'));
    }

    

    const updatedAlbum = await Category.findByIdAndUpdate(
      req.params.albumId,
      {
        $set: {
          albumName: req.body.albumName,
          description: req.body.description,
          image: req.body.image,
        }
      },
      { new: true }
    );

    res.status(200).json(updatedAlbum);
  } catch (error) {
    next(error);
  }
};