require('dotenv').config();
const Stripe = require('stripe');
const axios = require('axios');
const stripe = Stripe(process.env.STRIPE_TOKEN_ACESS); // <- this is the access token for the stripe 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//this class is to create a payments
class Payment {

    constructor(products) {
        /*
            {
                "products": [
                                {
                                    "unit_amount": 30,
                                    "product_id" : 3,
                                    "currency":  "brl", 
                                    "quantity": 3
                                }
                            ]
            }
        */
        this.products = products;
    };


    async createPaymentLink() {
        let line_items = [];
        await Promise.all(
            this.products.map(
                async (product, index) => {
                    const founded_product_by_id = await prisma.product.findUnique(
                        {
                            where: {
                                id: product.product_id
                            }
                        }
                    );
                    if (!founded_product_by_id) {
                        return `the id isn't find on the product ${index}`;
                    };
                    line_items.push(
                        {
                            price_data: {
                                currency: 'brl',
                                unit_amount: product.unit_amount * 100,
                                product_data: {
                                    name: founded_product_by_id.name
                                }
                            },
                            quantity: product.quantity
                        }
                    );
                }
            )
        );
        console.log(line_items);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            //[{
            //     price_data: {
            //         currency: 'brl',
            //         unit_amount: 20000,
            //         product_data: { name: "test 111" },
            //     },
            //     quantity: 2,
            // }],
            mode: 'payment',
            success_url: `http://example.com`,
            
        });
        return session;
    };
    //this function create the wevhook using the stripe api
    static async webhook(req, res) {
        const event = req.body;
        // const signature = req.headers['stripe-signature'];

        // try {
        //     event = stripe.webhooks.constructEvent(
        //         req.body,
        //         signature,
        //         process.env.STRIPE_WEBHOOK_SECRET
        //     );
        // } catch (err) {
        //     console.error("⚠️  Invalid webhook signature", err.message);
        //     return res.sendStatus(400);
        // };

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log(paymentIntent);
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                // Then define and call a method to handle the successful attachment of a PaymentMethod.
                // handlePaymentMethodAttached(paymentMethod);
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event

    };
};

module.exports = Payment;