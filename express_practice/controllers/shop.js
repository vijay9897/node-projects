const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products',
            path: '/products'
        });
    })
    .catch(err => {
        res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        })
    })
    .catch(err => {
        res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'Shop',
            path: '/'
        });
    })
    .catch(err => {
        res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getCart = (req, res, next) => {
    console.log(req.user);
    req.user
    .populate('cart.items.productId')
    .then(cart => {
        const products = cart.cart.items;
        res.render(
            'shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            }
        );
    })
    .catch(err => {
        res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.addToCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId).then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        // console.log(result);
        res.redirect('/cart');
    }).catch(err => {
        res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getOrder = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
    .then(orders => {
        res.render(
            'shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            }
        );
    })
    .catch(err => {
        res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(cart => {
        const products = cart.cart.items.map(i => {
            return {quantity: i.quantity, product: {...i.productId._doc}};
        });
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user._id
            },
            products: products
        });    
        return order.save()
    }).then(result => {
        return req.user.clearCart();
    }).then(() => {
        res.redirect('/orders');
    }).catch(err => {
        res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'checkout'
    })
}

exports.deleteItemFromCart = (req, res, next) => {
    const prodId = req.body.prodId;
    req.user.deleteItemFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}