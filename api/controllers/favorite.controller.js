import Music from '../models/music.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const toggleFavorite = async (req, res, next) => {
  try {
    const { musicId } = req.params;
    const userId = req.user.id;

    // Check if music exists
    const music = await Music.findById(musicId);
    if (!music) {
      return next(errorHandler(404, 'Music not found'));
    }

    // Find user and check if music is already favorited
    const user = await User.findById(userId);
    const isFavorited = user.favorites.includes(musicId);

    let updatedUser;
    let updatedMusic;
    
    if (isFavorited) {
      // Remove from favorites
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
      // Add to favorites
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
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favorites');

    res.status(200).json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};