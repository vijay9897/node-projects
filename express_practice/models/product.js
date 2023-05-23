const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const rootDir = require('../utils/path');
const products = [];

const p = path.join(rootDir, 'data', 'products.json');

const readProductsFromFile = cb => {
    fs.readFile(p, (err, data) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(data));
    });
}

module.exports = class Product {
    constructor(id, title, image, price, description) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
    }

    save() {
        readProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updateProducts = [...products];
                updateProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        readProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAllProducts(callback) {
        readProductsFromFile(callback);
    }

    static findById(id, cb) {
        readProductsFromFile(products => {
            const prod = products.find(p => p.id === id);
            cb(prod);
        });
    }
}