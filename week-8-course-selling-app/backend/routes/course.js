const express = require("express");
const route = express.Router();
const userAuth = require("../middlewares/userAuth");

route.get("/", (req, res) => {});

route.post("/purchase", userAuth, (req, res) => {});

module.exports = route;
