const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {});

router.post("/signup", (req, res) => {});

router.get("/purchases", (req, res) => {
  res.json({ purchases: ["no purchases yet"] });
});

module.exports = router;
