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
        let productsId = [];
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
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            metadata: {
                productsId: JSON.stringify(productsId)
            },
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
            case 'checkout.session.completed':
                const session = event.data.object;
                const productsId  = session.metadata.productsId;
                console.log(productsId);
                try {
                    const purchase = await axios.post('http://localhost:4000/api/purchases/create', {
                        userId : 1,
                        productId: JSON.parse(productsId[0]),
                        addressId: 1,
                        quantity: 1
                    });
                    console.log(purchase);
                }catch(e) {
                    console.log(e.message);
                }
                break;

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