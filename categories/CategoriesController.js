const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugiFy = require("slugify");

router.get("/admin/categories/new", (req, res) => {
    res.render('admin/categories/new');
});

router.post("/categories/save", (req, res) => {
    const title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugiFy(title)
        }).then(() => {
            res.redirect("/");
        }).catch(err => console.log(err));
    }else{
        // redireciona o user pra cadastrar novamente
        res.redirect("/admin/categories/new");
    }
});

module.exports = router;

// lembrando que não precisa da pasta view por conta do express já ir até ela procurar as views.