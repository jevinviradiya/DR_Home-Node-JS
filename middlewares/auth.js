const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = async (req, res, next) => {
  const token =
  req.headers.authorization || req.query.authorization || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = await jwt.verify(token.split(' ')[1], config.TOKEN_KEY);
    // console.log(decoded, 'decoded')
    req.user = decoded;
    next()
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  // return next();
};

module.exports = verifyToken;