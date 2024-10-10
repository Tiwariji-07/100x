const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_ADMIN_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, jwtSecret);
    if (decodedToken) {
      req.adminId = decodedToken.id;
      next();
    } else {
      res.status(401).json({
        message: "You are not authenticated!",
      });
    }
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
