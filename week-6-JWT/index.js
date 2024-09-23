const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisissecret";

app.use(express.json());

let users = [];

function auth(req, res, next) {
  let token = req.headers.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        res.status(401).send({ message: "Unauthorized" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}

app.post("/signin", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    let token = jwt.sign({ username: username }, JWT_SECRET);
    res.send({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.post("/signup", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let user = users.find((user) => user.username === username);
  if (!user) {
    users.push({ username: username, password: password });
    res.send("User created successfully");
  } else {
    res.status(400).send("Username already exists");
  }
});

app.get("/me", auth, function (req, res) {
  let user = req.user;

  res.send({ username: user.username });
});

app.listen(3000);
