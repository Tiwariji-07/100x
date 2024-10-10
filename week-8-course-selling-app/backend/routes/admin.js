const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const AdminModel = require("../models/Admin");
const CourseModel = require("../models/Course");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_ADMIN_SECRET;

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

const createCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  // _id: z.string().or(z.null),
});
const updateCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  _id: z.string().or(z.null),
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

router.post("/course", adminAuth, async (req, res) => {
  const adminId = req.adminId;
  const coursedata = createCourseSchema.parse(req.body);
  coursedata.creatorId = adminId;
  CourseModel.create(coursedata)
    .then((course) => {
      res.status(200).json({
        message: "Successfully created the course",
        course: course._id,
      });
    })
    .catch((e) => {
      res.status(400).json({ message: e });
    });
});

router.put("/course", adminAuth, (req, res) => {
  const adminId = req.adminId;
  const coursedata = updateCourseSchema.parse(req.body);
  console.log(coursedata);
  CourseModel.updateOne(
    { creatorId: adminId, _id: coursedata._id },
    { $set: coursedata }
  )
    .then((course) => {
      res
        .status(200)
        .json({ message: "Successfully updated the course", course });
    })
    .catch((e) => {
      res.status(400).json({ message: e });
    });
});

router.get("/course/bulk", adminAuth, async (req, res) => {
  const adminId = req.adminId;
  const courses = await CourseModel.find({ creatorId: adminId })
    .then((courses) => {
      res.status(200).json(courses);
    })
    .catch((e) => {
      res.status(400).json({ message: e });
    });
});

router.get("/about", adminAuth, async (req, res) => {
  let about = await AdminModel.findOne({ _id: req.userId });
  if (about) {
    res.status(200).json({ message: "Successfully fetched", data: about });
  } else {
    res.status(400).json({ message: "Failed to fetch" });
  }
});

module.exports = router;
