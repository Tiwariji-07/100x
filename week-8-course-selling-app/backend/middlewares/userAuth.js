const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_USER_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.token;
    const decodedToken = jwt.verify(token, jwtSecret);
    if (decodedToken) {
      req.userId = decodedToken.id;
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
