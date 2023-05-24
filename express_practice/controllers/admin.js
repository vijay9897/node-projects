const { ObjectId } = require('mongodb');
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
    const product = new Product(title, image, price, description, null, req.user._id);
    product
    .save()
    .then(result => {
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
}

exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    })
    .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, image, price, description, prodId);
        product
        .save()
        .then(result => {
            console.log('Updated product!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId).then(() => {
        console.log('Product deleted!');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
}