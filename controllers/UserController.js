const User = require('../services/User');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = new User(name, email, password);
            const msg = await user.save();
            res.status(201).json({ message: msg }); // 201 Created
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const { token, message } = await User.login(email, password);
            
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ message }); // 200 OK
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            console.log(req.cookies);
            const userData = await User.getUserData(req);
            res.status(200).json(userData); // 200 OK
        } catch (err) {
            res.status(403).json({ error: err.message });
        }
    },

    update: async (req, res) => {
        try {
            const token = req.cookies.token;
            if (!token) throw new Error('No token found');

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

            const { name, email, password } = req.body;
            const user = new User(); // dummy instance to use class method
            const updated = await user.editUser(decoded.id, name, email, password);

            res.status(200).json(updated); // 200 OK
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    delete: async (req, res) => {
        try {
            const result = await User.deleteUser(req, res);
            res.status(200).json(result); // 200 OK
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }
};
