const fs = require('fs');
const path = require('path');

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
    constructor(title) {
        this.title = title
    }

    save() {
        readProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAllProducts(callback) {
        readProductsFromFile(callback);
    }
}