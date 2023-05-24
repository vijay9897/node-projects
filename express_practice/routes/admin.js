const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const { route } = require('./shop');

const router = express.Router();

router.get('/add-product', adminController.getAddProducts);
router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);
router.get('/edit-product/:productId', adminController.getEditProducts);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.deleteProduct);

module.exports = router;