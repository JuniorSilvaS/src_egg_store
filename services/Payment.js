require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_TOKEN_ACESS); // <- this is the access token for the stripe 

//this class is to create a payments
class Payment {
    constructor(currency, unit_amount, product_name, quantity) {
        this.currency = currency;
        this.unit_amount = unit_amount;
        this.product_name = product_name;
        this.quantity = quantity;
    };

    //this function create a payment link using the stripe api
    async createPaymentLink() {
        try {
            //create the price first because it's needed
            const price = await stripe.prices.create({
                currency: this.currency,
                unit_amount: this.unit_amount * 10,
                product_data: {
                    name: this.product_name
                }
            });
            //create the payment link finally
            const payment = await stripe.paymentLinks.create({
                line_items: [
                    {
                        price: price.id,
                        quantity: this.quantity
                    }
                ]
            });
            return payment;
        } catch (err) {
            console.log(err);
        }
    };
};

module.exports = Payment;