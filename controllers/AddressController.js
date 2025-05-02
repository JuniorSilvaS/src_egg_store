const Address = require('./../services/Address');

module.exports = {
    create: async (req, res) => {
        //take the params of the body
        const { addressLine, city, state, postalCode, country, userId } = req.body;
        try {
            const address = new Address(addressLine, city, state, postalCode, country, userId); // pass the correct params
            const response = await address.save();
            res.status(201).json({ message: 'Address created successfully', address: response });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    getByUser: async (req, res) => {
        const { userId } = req.params;

        try {
            const addresses = await Address.getByUserId(parseInt(userId));
            res.status(200).json(addresses);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            await Address.deleteById(parseInt(id));
            res.status(200).json({ message: 'Address deleted successfully' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
