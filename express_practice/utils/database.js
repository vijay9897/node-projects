const Sequelize = require('sequelize');

const sequelize = new Sequelize('shopping_db', 'root', '123456', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;