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

const mongoDb = require('mongodb');
const { getDB } = require('../utils/database');

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    save() {
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    static findById(userId) {
        const db = getDB();
        return db.collection('users')
        .findOne({_id: new mongoDb.ObjectId(userId)})
        .then(user => {
            return user;
        })
        .catch(err => console.log(err));
    }
}

module.exports = User;