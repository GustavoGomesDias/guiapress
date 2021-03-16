const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugiFy = require('slugify');
const adminAuth = require("../middlewares/adminAuth");

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {
            articles: articles
        });
    });

    // include: [{model: Category}] => incluindo category na busca. Ele faz isso através do relacionamento

});

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {
            categories: categories
        });
    })
});

router.post("/articles/save", adminAuth,(req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });

})

router.post("/admin/articles/delete", adminAuth,(req, res)=> {
    const id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Articles.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", adminAuth,(req, res) => {
    const id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/articles");
    }

    /* Pesquisar por id */
    Article.findByPk(id).then(article => {
        if(article != undefined){

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {
                    article: article,
                    categories: categories
                });
            });

        }else{
            res.redirect("/admin/articles");
        }
    }).catch(err => {
        console.log(err);
        res.redirect("/admin/articles");
    });
});

router.post("/admin/articles/update", adminAuth,(req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.update({title: title, body: body, categoryId: category, slug: slugiFy(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        console.log(err);
        res.redirect("/admin/articles");
    });

});

router.get("/articles/page/:num", (req, res) => {
    const page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) * 4;
    }

    Article.findAndCountAll({
        // Limita a qtd. de elementos retornados
        limit: 4,
        // Retorna um artigo após x artigo (x = num)
        offset: offset,
        order: [
            ['id', 'DESC']
        ],
    }).then(articles => {
        
        // Verifica se tem uma próx. pág
        var next;
        // articles.count => count vem de findAndCountAll
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        const result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {
                result: result,
                categories: categories
            })
        });
    });

});


module.exports = router;

// findAndCountAll => Pesquisa e retorna todos os elementos e q qtd. de elementos que tem nos artigos