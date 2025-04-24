const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/getUserData', UserController.getProfile);
router.put('/editUser', UserController.update);
router.delete('/deleteUser', UserController.delete);

module.exports = router;