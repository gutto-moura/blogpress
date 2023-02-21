const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const usersController = require("./user/usersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/Users")

connection.authenticate().then(() => {
  console.log("CONECTADO AO BANCO blogpress")
}).catch((err) => {
  console.log(err)
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
  Article.findAll({
    order:[ 
      ['id', 'DESC']
    ],
    limit: 4
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render('index', {articles: articles, categories:categories});
    })
  })
});

app.get("/:slug", (req, res) => {
  var slug = req.params.slug;
  Article.findOne({
    where:{
      slug: slug
    },
    include: [{model: Article}]
  }).then((article) => {
    if(article != undefined){
      Category.findAll().then((categories) => {
        res.render('articles', {article: article, categories:categories});
      })
    }else{
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  })
});

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;

  Category.findOne({
    where: {
      slug: slug
    }, include: [{model: Article}]
  }).then(category => {
    if(category != undefined){
      category.findAll().then(categories => {
        res.render('index', {articles: category.articles, categories: categories});
      });
    }else{
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  })
})

app.listen(8800, () => {
  console.log("RODANDO NA PORTA 8800")
});