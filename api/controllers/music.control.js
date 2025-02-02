import Music from "../models/music.model.js";
import Order from "../models/order.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from 'mongoose'; 

export const createMusic = async (req, res, next) => {
    try {
     
      const { title, description, category, music} = req.body;
  
      console.log(description);
      console.log(title);
      console.log(music);
      
  
      if (!title || !description || !music) {
        return next(errorHandler(400, 'Please provide all required fields'));
      }
  
      const slug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
      const newMusic = new Music({
        title,
        description,
        category: category || 'uncategorized',
        slug,
        music,
        image: req.body.image || 'https://i0.wp.com/woodwoon.com/wp-content/uploads/2023/01/SOS0002-sofa-set-sofa-design-furniture-store-in-pakistan.webp?fit=1024%2C787&ssl=1'
      });
  
      const savedMusic = await newMusic.save();
      res.status(201).json(savedMusic);
    } catch (error) {
      next(error);
    }
  };
  

  export const getAllMusic = async (req, res, next) => {
    try {
      const { searchTerm = '' } = req.query;
      const query = searchTerm ? { title: { $regex: searchTerm, $options: 'i' } } : {};
  
     
      const totalMusic = await Music.countDocuments(query);
  
   
      const firstDayLastMonth = new Date();
      firstDayLastMonth.setDate(1);
      firstDayLastMonth.setMonth(firstDayLastMonth.getMonth() - 1);
      firstDayLastMonth.setHours(0, 0, 0, 0);
      
      const lastDayLastMonth = new Date();
      lastDayLastMonth.setDate(0); 
      lastDayLastMonth.setHours(23, 59, 59, 999);
  
      
      const lastMonthMusic = await Music.countDocuments({
        ...query,
        updatedAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth }
      });
  
      const music = await Music.find(query);
  
      res.status(200).json({
        music,
        totalMusic,
        lastMonthMusic,
      });
    } catch (error) {
      next(error);
    }
  };
  

  export const getMusicById = async (req, res, next) => {
    try {
        const { musicId } = req.params;
        // Fetch the music by ID
        const music = await Music.findById(musicId);
        
        // Check if music exists
        if (!music) {
            return next(errorHandler(404, 'Music not found'));
        }

        res.status(200).json(music);
    } catch (error) {
        next(error);
    }
};
  

export const updateMusic = async (req, res, next) => {
  try {
    

    const updatedMusic = await Music.findByIdAndUpdate(
      req.params.musicId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          image: req.body.image,
          music: req.body.music,
        },
      },
      { new: true }
    );
    if (!updatedMusic) {
      return next(errorHandler(404, 'Music not found'));
    }
    res.status(200).json(updatedMusic);
  } catch (error) {
    next(error);
  }
};

export const deleteMusic = async (req, res, next) => {
    try {
     
      await Music.findByIdAndDelete(req.params.musicId);
      res.status(200).json('The product has been deleted');
    } catch (error) {
      next(error);
    }
  };


 
  export const getMusicByCategory = async (req, res, next) => {
    try {
      const { category } = req.query;
  
      if (!category) {
        return res.status(400).json({ message: 'Category is required' });
      }
  
      const queryOptions = { category };
      
      const music = await Music.find(queryOptions);
  
      res.status(200).json({
        music,
        totalMusic: music.length, 
      });
    } catch (error) {
      next(error);
    }
  };