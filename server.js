require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookiesParser = require('cookie-parser');

//config to the usefull
app.use(cors());
app.use(express.json());
app.use(cookiesParser());
const userRoutes = require('./routes/UserRoutes');
const addressRoutes = require('./routes/AddressRoutes');
const productRoutes = require('./routes/ProductsRoutes');
const purchasesRoutes = require('./routes/PurchasesRoutes');


app.use('/api/address', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchasesRoutes);

//routes config
app.use('/api/user/', userRoutes);

module.exports = app;