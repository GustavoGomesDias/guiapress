const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category') 

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});
Category.hasMany(Article);
Article.belongsTo(Category);

// Article.sync({ force: true }); //=> comentada para não rodar novamente (descomentar se for criar a tabela de novo)


module.exports = Article;
// belongsTo = pertence a
// Aqui estamos dizendo que um artigo pertence a uma categoria
// É a forma de representar o 1-P-1

// hasMay é para representar o relacionamento de um para muitos (1-P-N)
// Uma categoria tem vários artigos