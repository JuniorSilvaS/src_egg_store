require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookiesParser = require('cookie-parser');

//config to the usefull
app.use(cors());
app.use(express.json());
app.use(cookiesParser());

//the imports of the Routes
const userRoutes = require('./routes/UserRoutes');
const addressRoutes = require('./routes/AddressRoutes');
const productRoutes = require('./routes/ProductsRoutes');
const purchasesRoutes = require('./routes/PurchasesRoutes');
const paymentRoutes = require('./routes/PaymentRoutes');

app.use('/api/address', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/payment', paymentRoutes);

module.exports = app;