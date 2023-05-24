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
    req.user.createProduct({
        title: title,
        image: image,
        price, price,
        description: description
    }).then(result => {
        console.log('Product created!');
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
    Product.findByPk(prodId)
    .then(product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/eidt-product',
            editing: editMode,
            product: product
        });
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
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
    Product.findByPk(prodId)
    .then(product => {
        product.title = title;
        product.image = image;
        product.price = price;
        product.description = description;
        return product.save();
    })
    .then(result => {
        console.log('Updated product!');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.destroy({
        where: {id: prodId}
    }).then(result => {
        console.log('Product deleted!');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
}