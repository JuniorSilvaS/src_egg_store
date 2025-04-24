const Product = require('./../services/Product');

module.exports = {
    // Create a new product
    create: async (req, res) => {
        const { name, price, quantity } = req.body;
        try {
            const product = new Product(name, price, quantity);
            const response = await product.save();
            res.status(201).json({ msg: "Product created successfully!", response });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get all products
    getAll: async (req, res) => {
        try {
            const products = await Product.getAll();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get product by ID
    getById: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await Product.getById(parseInt(id));
            res.status(200).json(product);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    // Update a product
    update: async (req, res) => {
        const { id } = req.params;
        const { name, price, quantity } = req.body;
        try {
            const updated = await Product.update(parseInt(id), { name, price, quantity });
            res.status(200).json({ msg: "Product updated", updated });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete a product
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            await Product.delete(parseInt(id));
            res.status(200).json({ msg: "Product deleted successfully" });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
};
