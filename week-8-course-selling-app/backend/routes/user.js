const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/signin", async (req, res) => {
  let userData = loginSchema.parse(req.body);
  let founduser = await UserModel.findOne({ email: userData.email });
  if (founduser) {
    bcrypt.compare(userData.password, founduser.password).then((result) => {
      if (result) {
        const token = jwt.sign(
          {
            id: founduser._id.toString(),
          },
          jwtSecret
        );
        res
          .status(200)
          .json({ message: "Successfully logged in", token: token });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    });
  } else {
    res.status(400).json({ message: "User Not found" });
  }
});

router.post("/signup", async (req, res) => {
  let userData = userSchema.parse(req.body);
  userData.password = await bcrypt.hash(userData.password, 10);
  console.log(userData);
  let user = await UserModel.findOne({ email: userData.email });
  console.log(user);
  if (!user) {
    UserModel.create(userData)
      .then(() => {
        res.status(200).json({ message: "Successfully signed up" });
      })
      .catch((e) => {
        res.status(400).json({ message: e });
      });
  } else {
    res
      .status(400)
      .json({ message: "Email already used! Use different email address" });
  }
});

router.get("/purchases", userAuth, (req, res) => {
  res.json({ purchases: ["no purchases yet"] });
});

module.exports = router;
