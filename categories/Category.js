const Sequelize = require('sequelize');
const connection = require('../database/database'); 

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Category.sync({ force: true }); //=> comentada para não rodar novamente (descomentar se for criar a tabela de novo)

module.exports = Category;

// slug => versão do titulo de uma certa categoria que usamos na rota

// Category.sync({ force: true }) => força a recriação da tablea sempre rodar o serve