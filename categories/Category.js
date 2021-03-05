const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('categories', {
    tile: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Category;


// slug => versão do titulo de uma certa categoria que usamos na rota