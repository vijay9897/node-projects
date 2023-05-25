// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('shopping_db', 'root', '123456', {
//     dialect: 'mysql',
//     host: 'localhost'
// });

// module.exports = sequelize;

const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient
    // .connect('mongodb+srv://admin:admin@cluster0.rodbnjy.mongodb.net/?retryWrites=true&w=majority')
    .connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.0')
    .then(client => {
        console.log('Connected');
        _db = client.db('shopping_db');
        callback(client);
    })
    .catch(err => {
        console.log(err);
    });
}

const getDB = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database Found;'
}

module.exports = { mongoConnect, getDB };