const Payment = require('./../services/Payment');

module.exports = {
    createPaymentLink: async function (req, res) {
        try {
            //get the require params of the body requisition
            const { products } = req.body;
            //create the payment 
            const payment = new Payment(products);
            // take the response and return then.

            const response = await payment.createPaymentLink();
            res.status(200).json({ response });
        } catch (err) {
            //log the error if exists any error.
            
            res.status(404).json({ error : err.message });
        };
    },
    webhook: async function(req, res) {
        const response = Payment.webhook(req, res);
        return res.status(200).json({msg : 'hello world'});
    }
};