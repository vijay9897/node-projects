const db = require('../utils/database');

const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, image, price, description) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products (title, image, price, description) VALUES(?, ?, ?, ? )', [this.title, this.image, this.price, this.description]);
    }

    static deleteById(id) {
        
    }

    static fetchAllProducts() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}