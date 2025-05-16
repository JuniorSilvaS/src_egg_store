require('dotenv').config();
const Stripe = require('stripe');
const axios = require('axios');
const stripe = Stripe(process.env.STRIPE_TOKEN_ACESS); // <- this is the access token for the stripe 
const { PrismaClient } = require('@prisma/client');
const User = require('./User');
const { json } = require('express');
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


    async createPaymentLink(req, res) {
        let line_items = [];
        let productsId = [];
        try {
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
                        productsId.push(product.product_id);
                        console.log(productsId);
                    }
                )
            );

        } catch (e) {
            console.log(e);
        };
        //get the users data 
        let userDatas;
        try {
             userDatas = await User.getUserData(req);
            console.log(userDatas);
        } catch (e) {
            console.log(e);
        };

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: line_items,
                metadata: {
                    productsId: JSON.stringify(productsId),
                    userData : JSON.stringify(userDatas)
                },
                mode: 'payment',
                success_url: `http://example.com`,
            });
            return session;
        } catch (e) {
            console.log(e);
        };
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
            case 'checkout.session.completed':
                const a = await axios.post(`${process.env.BACKEND_URL}` , {
                    userId: 1,
                    addressId : 1,
                    items : [
                        {
                            productId: 1, 
                            quantity: 1
                        }
                    ]
                });
                console.log(a);
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                // handle it
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }


        // Return a response to acknowledge receipt of the event

    };
};

module.exports = Payment;