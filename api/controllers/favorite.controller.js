import Music from '../models/music.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const toggleFavorite = async (req, res, next) => {
  try {
    const { musicId } = req.params;
    const { userId } = req.body; 

    if (!userId) {
      return next(errorHandler(401, 'User ID is required'));
    }

    
    const music = await Music.findById(musicId);
    if (!music) {
      return next(errorHandler(404, 'Music not found'));
    }

    
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const isFavorited = user.favorites.includes(musicId);

    let updatedUser;
    let updatedMusic;
    
    if (isFavorited) {
     
      [updatedUser, updatedMusic] = await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $pull: { favorites: musicId } },
          { new: true }
        ).populate('favorites'),
        Music.findByIdAndUpdate(
          musicId,
          { 
            $inc: { favoriteCount: -1 },
            $pull: { favoritedBy: userId }
          },
          { new: true }
        )
      ]);
    } else {
      [updatedUser, updatedMusic] = await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $addToSet: { favorites: musicId } },
          { new: true }
        ).populate('favorites'),
        Music.findByIdAndUpdate(
          musicId,
          { 
            $inc: { favoriteCount: 1 },
            $addToSet: { favoritedBy: userId }
          },
          { new: true }
        )
      ]);
    }

    res.status(200).json({
      success: true,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      favorites: updatedUser.favorites,
      music: {
        id: updatedMusic._id,
        favoriteCount: updatedMusic.favoriteCount,
        isFavorited: !isFavorited
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const { userId } = req.body; 

    if (!userId) {
      return next(errorHandler(401, 'User ID is required'));
    }

    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};