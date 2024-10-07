const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const jwt = require("jsonwebtoken");
const port = process.env.PORT;

const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");

const app = express();
app.use(express.json());

app.use("/user", userRouter);

app.use("/courses", courseRouter);

app.listen(port);
