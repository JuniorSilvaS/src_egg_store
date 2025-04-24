const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productController');

router.post('/createProduct', productController.create);
router.get('/getAll', productController.getAll);
router.get('/getProductById/:id', productController.getById);
router.put('/editProductById/:id', productController.update);
router.delete('/deleteProductById/:id', productController.delete);

module.exports = router;