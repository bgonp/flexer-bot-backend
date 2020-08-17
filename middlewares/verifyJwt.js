const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const jwt = req.header("Authorization");

  if (!jwt) {
    return res.status(400).json({
      error: true,
      message: "Token required",
    });
  }

  try {
    const { id, email } = jwt.verify(jwt, process.env.SECRET_JWT_SEED);

    req.id = id;
    req.email = email;
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Wrong token",
    });
  }

  next();
};

module.exports = { verifyJwt };
