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
    res.render("index");
});

app.listen(8080, () => {
    console.log("Server is running!");
});