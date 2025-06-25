import AIOrder from '../models/aiorder.model.js';

export const getAIOrders = async (req, res) => {
  try {
    const { searchTerm, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (searchTerm) {
      query.$or = [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { mobile: { $regex: searchTerm, $options: 'i' } },
        { orderId: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const [orders, totalOrders, lastMonthOrders] = await Promise.all([
      AIOrder.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AIOrder.countDocuments(query),
      AIOrder.countDocuments({
        createdAt: { 
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) 
        }
      })
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      orders,
      totalOrders,
      lastMonthOrders,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error getting AI orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAIOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await AIOrder.findOneAndDelete({ orderId });

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting AI order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};