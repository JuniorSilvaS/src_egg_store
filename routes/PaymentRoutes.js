const express = require('express');
const router = express.Router();
const paymentController = require('./../controllers/paymentController');
router.post('/createPaymentLink', paymentController.createPaymentLink);
router.post('/webhook', paymentController.webhook);
module.exports = router;