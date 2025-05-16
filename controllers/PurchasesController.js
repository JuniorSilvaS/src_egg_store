const Purchase = require('../services/Purchase');

module.exports = {
  create: async (req, res) => {
    const { userId, items, addressId } = req.body;

    try {
      const purchase = new Purchase({ userId, addressId, items });
      const response = await purchase.save();
      res.status(201).json({ message: 'Purchase created successfully', purchase: response });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const purchase = await Purchase.getById(Number(id));
      res.status(200).json(purchase);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  getByUserId: async (req, res) => {
    const { userId } = req.params;

    try {
      const purchases = await Purchase.getByUserId(Number(userId));
      res.status(200).json(purchases);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await Purchase.delete(Number(id));
      res.status(200).json({ message: 'Purchase deleted', purchase: deleted });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
