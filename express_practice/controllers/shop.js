const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products',
            path: '/products',
        });
    })
    .catch(err => {
        console.log(err);
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
    .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'Shop',
            path: '/',
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(cart => {
        return cart.getProducts()
    }).then(products => {
        res.render(
            'shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            }
        );
    })
    .catch(err => console.log(err))
}

exports.addToCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
    .getCart()
    .then(cart => {
        if (cart) {
            return cart
        }
        return req.user.createCart()
    })
    .then(cart => {
        fetchedCart = cart;
        return fetchedCart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
        let product;
        if (products && products.length > 0) {
            product = products[0]
        }
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(prodId)
    })
    .then(product => {
        return fetchedCart.addProduct(product, {
            through: {
                quantity: newQuantity
            }
        });
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err))
}

exports.getOrder = (req, res, next) => {
    req.user
    .getOrders({include: ['products']})
    .then(orders => {
        console.log(orders);
        res.render(
            'shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            }
        );
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            order.addProducts(products.map(prod => {
                prod.orderItem = {
                    quantity: prod.cartItem.quantity
                };
                return prod;
            }));
        })
        .catch(err => console.log(err));
    })
    .then(result => {
        return fetchedCart.setProducts(null);
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'checkout'
    })
}

exports.deleteItemFromCart = (req, res, next) => {
    const prodId = req.body.prodId;
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}