const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is_auth');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.addToCart);
router.get('/orders', isAuth, shopController.getOrder);
router.post('/create-order', isAuth, shopController.postOrder);
// router.get('/checkout', shopController.getCheckout);
router.post('/cart-delete-item', isAuth, shopController.deleteItemFromCart);

module.exports = router;