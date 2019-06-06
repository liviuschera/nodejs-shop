const Sequelize = require('sequelize/index');

const sequelize = new Sequelize('nodejs-shop', 'root', 'root', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;
