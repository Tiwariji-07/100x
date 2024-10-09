const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const AdminModel = require("../models/Admin");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/signup", async (req, res) => {
  let adminData = adminSchema.parse(req.body);
  adminData.password = await bcrypt.hash(adminData.password, 10);
  console.log(adminData);
  let admin = await AdminModel.findOne({ email: adminData.email });
  console.log(admin);
  if (!admin) {
    AdminModel.create(adminData)
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

router.post("/signin", async (req, res) => {
  let adminData = loginSchema.parse(req.body);
  let foundAdmin = await AdminModel.findOne({ email: adminData.email });
  if (foundAdmin) {
    bcrypt.compare(adminData.password, foundAdmin.password).then((result) => {
      if (result) {
        const token = jwt.sign(
          {
            id: foundAdmin._id.toString(),
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

router.post("/course", adminAuth, (req, res) => {});
router.put("/course", adminAuth, (req, res) => {});
router.get("/course/bulk", adminAuth, (req, res) => {});

router.get("/about", adminAuth, async (req, res) => {
  let about = await AdminModel.findOne({ _id: req.userId });
  if (about) {
    res.status(200).json({ message: "Successfully fetched", data: about });
  } else {
    res.status(400).json({ message: "Failed to fetch" });
  }
});

module.exports = router;
