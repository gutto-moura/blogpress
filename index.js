const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

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

app.get("/", (req, res) => {
  Article.findAll().then((articles) => {
    res.render('index', {articles: articles});
  })

})

app.listen(8800, () => {
  console.log("RODANDO NA PORTA 8800")
});