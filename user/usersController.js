const express = require("express");
const router = express.Router();
const User = require("./Users");

router.get("/admin/users", (req, res) => {
  res.send("Listagem de usuários");
})

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

exports.module = router;