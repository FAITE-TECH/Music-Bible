import Music from '../models/music.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const toggleFavorite = async (req, res, next) => {
  try {
    const { musicId } = req.params;
<<<<<<< HEAD
    const userId = req.user.id;

    // Check if music exists
=======
    const { userId } = req.body; 

    if (!userId) {
      return next(errorHandler(401, 'User ID is required'));
    }

    
>>>>>>> 4c92959 (new)
    const music = await Music.findById(musicId);
    if (!music) {
      return next(errorHandler(404, 'Music not found'));
    }

<<<<<<< HEAD
    // Find user and check if music is already favorited
    const user = await User.findById(userId);
=======
    
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

>>>>>>> 4c92959 (new)
    const isFavorited = user.favorites.includes(musicId);

    let updatedUser;
    let updatedMusic;
    
    if (isFavorited) {
<<<<<<< HEAD
      // Remove from favorites
=======
     
>>>>>>> 4c92959 (new)
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
<<<<<<< HEAD
      // Add to favorites
=======
>>>>>>> 4c92959 (new)
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
<<<<<<< HEAD
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favorites');
=======
    const { userId } = req.body; 

    if (!userId) {
      return next(errorHandler(401, 'User ID is required'));
    }

    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
>>>>>>> 4c92959 (new)

    res.status(200).json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};