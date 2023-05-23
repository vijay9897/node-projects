const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, image, price, description);
    product.save();
    res.redirect('/');
}

exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/eidt-product',
            editing: editMode,
            product: product
        });
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAllProducts(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products',
            path: '/admin/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    const prod = new Product(prodId, title, image, price, description);
    prod.save();
    res.redirect('/admin/products');
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}