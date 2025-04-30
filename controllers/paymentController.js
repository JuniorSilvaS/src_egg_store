const Payment = require('./../services/Payment');

module.exports = {
    createPaymentLink : async function (req, res) {
        const {currency , unit_amount,  product_name , quantity} = req.body;
        const payment = new Payment(currency, unit_amount, product_name, quantity);
        const response = await  payment.createPaymentLink();
        res.status(200).json({ response });
    }
};