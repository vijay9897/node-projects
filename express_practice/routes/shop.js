const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.get('/orders', shopController.getOrder);
router.get('/checkout', shopController.getCheckout);

module.exports = router;