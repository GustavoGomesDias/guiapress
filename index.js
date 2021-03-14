const express = require('express');
const app = express();
const connection = require('./database/database');

// Controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/articlesController');

// Models
const Article = require('./articles/Article');
const Category = require('./categories/Category');

// View engine
app.set('view engine', 'ejs');

// Arq. estáticos
app.use(express.static('public'));

// Body parser tá dentro do express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB
connection
    .authenticate()
    .then(() => {
        console.log("Conectado ao DB!");
    })
    .catch(err => console.log(err));



app.use('/', categoriesController);
app.use('/', articlesController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {
                articles: articles,
                categories: categories
            });
        });

    });
});

app.get('/:slug', (req, res) => {
    const slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {
                    article: article,
                    categories: categories
                });
            });
    
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        console.log(err);
        res.redirect("/")
    })
});

app.get("/category/:slug", (req, res) => {
    const slug = req.params.slug;
    console.log(slug);
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
        
            Category.findAll().then(categories => {
                res.render("index", {
                    articles: category.articles,
                    categories: categories
                })
            });

        }else{
            res.redirect("/");
        }
    }).catch(err => {
        console.log(err)
    });
});

app.listen(8080, () => {
    console.log("Server is running!");
});