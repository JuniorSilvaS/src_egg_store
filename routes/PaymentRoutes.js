const express = require('express');
const router = express.Router();
const paymentController = require('./../controllers/paymentController');
router.post('/createPaymentLink', paymentController.createPaymentLink);
module.exports = router;