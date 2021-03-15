const express = require('express');
const app = express();
const session = require('express-session');
const connection = require('./database/database');

// Controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/articlesController');
const usersController = require('./users/UsersController');

// Models
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

// View engine
app.set('view engine', 'ejs');

// Sessions
app.use(session({
    // Como se fosse a senha da sessão (como se fosse o salt)
    secret: "kjdbnjkfhnnbfsdf",

    // Forma em que o cookie é guardado no navegador
    // Cookie de identificação para a sessão do user
    // maxAge -> Tempo em que expira o cookie (medido em ms)
    cookie: {maxAge: 30000}
}))

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
app.use('/', usersController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
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