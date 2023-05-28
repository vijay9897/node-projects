// const { DataTypes } = require('sequelize');

// const sequelize = require('../utils/database');

// const User = sequelize.define('users', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: {
//         type: DataTypes.STRING
//     },
//     email: {
//         type: DataTypes.STRING
//     }
// });

// const mongoDb = require('mongodb');
// const { getDB } = require('../utils/database');

// class User {
//     constructor(username, email, cart, _id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = _id;
//     }

//     save() {
//         const db = getDB();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart(product) {
//         let newQuantity = 1;
//         let updatedCartItems = [];
//         let cartProductIndex = -1;
//         if (this.cart) {
//             cartProductIndex = this.cart.items.findIndex(cp => {
//                 return cp.productId.toString() === product._id.toString();
//             });
//             updatedCartItems = [...this.cart.items];
//         }

//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({productId: new mongoDb.ObjectId(product._id), quantity: newQuantity});
//         }
//         const updatedCart = {items: updatedCartItems};
//         const db = getDB();
//         return db.collection('users')
//         .updateOne({
//             _id: new mongoDb.ObjectId(this._id)
//         }, {
//             $set: {cart: updatedCart}
//         });
//     }

//     getCart() {
//         if (!this.cart) {
//             return Promise.resolve([]);
//         }
//         const db = getDB();
//         const productIds = this.cart.items.map(item => {
//             return item.productId;
//         })
//         return db.collection('products')
//         .find({_id: {$in: productIds}})
//         .toArray()
//         .then(products => {
//             return products.map(prod => {
//                 return {
//                     ...prod, quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === prod._id.toString();
//                     }).quantity
//                 }
//             })
//         })
//         .catch(err => console.log(err));
//     }

//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getDB();
//         return db.collection('users')
//         .updateOne({
//             _id: new mongoDb.ObjectId(this._id)
//         }, {
//             $set: {cart: {items:updatedCartItems}}
//         });
//     }

//     addOrder() {
//         const db = getDB();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new mongoDb.ObjectId(this._id),
//                     name: this.username,
//                     email: this.email
//                 }
//             }
//             return db.collection('orders')
//             .insertOne(order)
//         })
//         .then(result => {
//             this.cart = {items: []};
//             return db.collection('users')
//             .updateOne({
//                 _id: new mongoDb.ObjectId(this._id)
//             }, {
//                 $set: {cart: {items:[]}}
//             });
//         });
//     }

//     getOrders() {
//         const db = getDB();
//         return db.collection('orders').find({'user._id': new mongoDb.ObjectId(this._id)}).toArray();
//     }

//     static findById(userId) {
//         const db = getDB();
//         return db.collection('users')
//         .findOne({_id: new mongoDb.ObjectId(userId)})
//         .then(user => {
//             return user;
//         })
//         .catch(err => console.log(err));
//     }
// }

// module.exports = User;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
             quantity: {
                type: Number,
                required: true
             }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    let newQuantity = 1;
    let updatedCartItems = [];
    let cartProductIndex = -1;
    if (this.cart) {
        cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        updatedCartItems = [...this.cart.items];
    }

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({productId: product._id, quantity: newQuantity});
    }
    const updatedCart = {items: updatedCartItems};
    
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteItemFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);