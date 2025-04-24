const express = require('express');
const router = express.Router();
const purchaseController = require('./../controllers/PurchasesController');

router.post('/create', purchaseController.create);
router.get('/:id', purchaseController.getById);
router.get('/user/:userId', purchaseController.getByUserId);
router.delete('/:id', purchaseController.delete);

module.exports = router;
