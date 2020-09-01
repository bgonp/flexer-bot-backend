const jwt = require("jsonwebtoken");
const Bot = require("../models/Bot");

const verifyAccess = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.json({
      success: false,
      message: "Token required",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      res.json({
        success: false,
        message: "Wrong token",
      });
    } else {
      req.id = decoded.id;
      req.username = decoded.username;
      next();
    }
  });
};

const verifyRefresh = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.json({
      success: false,
      message: "Token required",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const bot = await Bot.findById(id);

    if (!bot || bot.refresh !== token) {
      throw new Error();
    }

    req.bot = bot;
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Wrong token",
    });
  }
};

module.exports = { verifyAccess, verifyRefresh };
