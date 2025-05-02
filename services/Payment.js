require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_TOKEN_ACESS); // <- this is the access token for the stripe 
//this class is to create a payments
class Payment {

    constructor(products) {
        //products it's an array with products that i will put in to make the payment link  something like this 
        /*
        products : [
            {
                currency: 'brl',
                unit_amount: 10,
                product_name : 'ovos de galinha caipira'
                quantity: 1
                },
                {
                    currency: 'brl',
                    unit_amount: 10,
                    product_name : 'ovos de galinha caipira'
                    quantity: 1
                    },
                    {
                        currency: 'brl',
                        unit_amount: 10,
                        product_name : 'ovos de galinha caipira'
                        quantity: 1
                        }, 
        ]
                        */
        this.products = products;
    };

    //this function create a payment link using the stripe apis
    async createPaymentLink() {
        try {
            // create the prices and put on an array
            const prices = await Promise.all(
                this.products.map(async (product) => {
                    const price = await stripe.prices.create({
                        currency: product.currency,
                        unit_amount: product.unit_amount * 100,
                        product_data: {
                            name: product.product_name,
                        },
                    });
                    return price;
                })
            );
            //put the objects in the line_items array
            const line_items = [];
            this.products.map((product, index) => {
                line_items.push(
                    {
                        price: prices[index].id,
                        quantity: product.quantity
                    }
                )
            });
            //finally create the payment
            const payment = await stripe.paymentLinks.create({
                line_items: line_items
            });
            return payment;
        } catch (err) {
            console.log(err);
        }
    };
};

module.exports = Payment;