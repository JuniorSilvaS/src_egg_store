const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');

router.post('/create', AddressController.create);
router.get('/getByUser/:userId', AddressController.getByUser); // get addresses by user
router.delete('/deleteById/:id', AddressController.delete);

module.exports = router;
