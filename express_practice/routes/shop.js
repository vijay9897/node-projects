const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.addToCart);
router.get('/orders', shopController.getOrder);
router.post('/create-order', shopController.postOrder);
// router.get('/checkout', shopController.getCheckout);
router.post('/cart-delete-item', shopController.deleteItemFromCart);

module.exports = router;