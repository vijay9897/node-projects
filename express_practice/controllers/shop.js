const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAllProducts(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        })
    })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAllProducts(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
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