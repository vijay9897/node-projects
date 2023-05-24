const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAllProducts()
    .then(([rows]) => {
        res.render('shop/product-list', {
            prods: rows, 
            pageTitle: 'All Products',
            path: '/products',
        });
    })
    .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(([product]) => {
        res.render('shop/product-detail', {
            product: product[0],
            pageTitle: product[0].title,
            path: '/products'
        })
    })
    .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.fetchAllProducts()
    .then(([rows, fieldData]) => {
        res.render('shop/index', {
            prods: rows, 
            pageTitle: 'Shop',
            path: '/',
        });
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAllProducts(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProduct = cart.products.find(prod => prod.id === product.id);
                if(cartProduct) {
                    cartProducts.push({productData: product, qty: cartProduct.qty});
                }
            }
            res.render(
                'shop/cart', {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products: cartProducts
                }
            );
        });
    });
}

exports.addToCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/');
}

exports.getOrder = (req, res, next) => {
    res.render(
        'shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders'
        }
    );
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'checkout'
    })
}

exports.deleteItemFromCart = (req, res, next) => {
    const prodId = req.body.prodId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}