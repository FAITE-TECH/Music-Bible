import musicorderModel from "../models/musicorder.model.js";
import Music from "../models/music.model.js";

export const getMusicPurchases = async (req, res) => {
  try {
    const { searchTerm, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (searchTerm) {
      query.$or = [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { mobile: { $regex: searchTerm, $options: 'i' } },
        { orderId: { $regex: searchTerm, $options: 'i' } },
        { musicTitle: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Calculate date for last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [purchases, totalPurchases, totalRevenue, lastMonthRevenue] = await Promise.all([
      musicorderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      musicorderModel.countDocuments(query),
      musicorderModel.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      musicorderModel.aggregate([
        { 
          $match: { 
            ...query,
            createdAt: { $gte: oneMonthAgo }
          } 
        },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ])
    ]);

    const totalPages = Math.ceil(totalPurchases / limit);

    res.status(200).json({
      purchases,
      totalPurchases,
      totalRevenue: totalRevenue[0]?.total || 0,
      lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error getting music purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMusicPurchase = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedPurchase = await musicorderModel.findOneAndDelete({ orderId });

    if (!deletedPurchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Error deleting music purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [purchases, totalPurchases] = await Promise.all([
      musicorderModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      musicorderModel.countDocuments({ userId })
    ]);

    // Ensure all purchases have the music file
    const purchasesWithMusic = await Promise.all(purchases.map(async (purchase) => {
      if (!purchase.musicFile) {
        const music = await Music.findById(purchase.musicId).lean();
        return {
          ...purchase,
          musicFile: music?.audioFile || purchase.musicFile,
          musicImage: music?.image || purchase.musicImage
        };
      }
      return purchase;
    }));

    const totalPages = Math.ceil(totalPurchases / limit);

    res.status(200).json({
      purchases: purchasesWithMusic,
      totalPurchases,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error getting user purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};