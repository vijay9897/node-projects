const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is_auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProducts);
router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', [
    body('title').isString().isLength({min: 3}).trim(),
    body('image').isURL(),
    body('price').isFloat(),
    body('description').isLength({min: 5, max: 400}).trim()
], isAuth, adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);
router.post('/edit-product', [
    body('title').isAlphanumeric().isLength({min: 3}).trim(),
    body('image').isURL(),
    body('price').isFloat(),
    body('description').isLength({min: 5, max: 400}).trim()
], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;