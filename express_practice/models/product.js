const mongoDB = require('mongodb');

const { getDB } = require('../utils/database');
class Product {
    constructor(title, image, price, description, _id, userId) {
        this.title = title;
        this.image = image;
        this.price = price;
        this.description = description;
        this._id = _id ? new mongoDB.ObjectId(_id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDB();
        let dbOP;
        if (this._id) {
            dbOP = db.collection('products')
            .updateOne({
                _id: this._id
            }, {
                $set: this
            })
        } else {
            dbOP = db.collection('products')
            .insertOne(this);
        }
        return dbOP
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
    }

    static fetchAll() {
        const db = getDB();
        return db
        .collection('products')
        .find()
        .toArray()
        .then(products => {
            return products;
        })
        .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDB();
        return db
        .collection('products')
        .find({_id: new mongoDB.ObjectId(prodId)})
        .next()
        .then(product => {
            return product
        })
        .catch(err => console.log(err)); 
    }

    static deleteById(prodId) {
        const db = getDB();
        return db.collection('products')
        .deleteOne({
            _id: new mongoDB.ObjectId(prodId)
        }).then(result => {

        }).catch(err => console.log(err));
    }
}

// const Product = sequelize.define('products', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     price: {
//         type: DataTypes.DOUBLE,
//         allowNull: false
//     },
//     image: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

module.exports = Product;