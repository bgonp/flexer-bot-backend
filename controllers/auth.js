const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");

const Bot = require("../models/Bot");
const { createAccessToken, createRefreshToken } = require("../helpers/jwt");
const { fetchUser } = require("../helpers/twitch");

const register = async (req, res) => {
  const { username, password, token, channel } = req.body;

  try {
    let bot = await Bot.findOne({ username });
    if (bot) {
      return res.json({
        success: false,
        message: "Bot username already registered",
      });
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const encryptedToken = CryptoJS.AES.encrypt(
      token,
      process.env.AES_SECRET
    ).toString();

    bot = new Bot({
      username,
      password: hashedPassword,
      token: encryptedToken,
      channel,
      avatar: "",
    });

    const refresh = await createRefreshToken(bot.id, bot.username);
    bot.refresh = refresh;

    await bot.save();

    const jwt = await createAccessToken(bot.id, bot.username);

    res.json({ success: true, jwt, refresh, bot: bot.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const bot = await Bot.findOne({ username });
    const validPassword = bot && bcrypt.compareSync(password, bot.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong credentials" });
    }

    const jwt = await createAccessToken(bot.id, bot.username);
    const refresh = await createRefreshToken(bot.id, bot.username);

    bot.refresh = refresh;
    await bot.save();

    res.json({ success: true, jwt, refresh, bot: bot.toJSON() });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

const logout = async (req, res) => {
  const { id } = req.body;
  Bot.findByIdAndUpdate(id, { refresh: "" }, () => {});
  res.json({ success: true });
};

const update = async (req, res) => {
  const { id, token, channel } = req.body;
  if (id !== req.id) {
    return res
      .status(403)
      .json({ success: false, message: "Wrong user token" });
  }

  const bot = await Bot.findById(id);
  if (!bot) {
    return res.status(400).json({ success: false, message: "Wrong bot ID" });
  }

  bot.token = token;
  bot.channel = channel;
  try {
    await bot.save();
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }

  res.json({ success: true });
};

const available = async (req, res) => {
  const { username } = req.query;

  try {
    const bot = await Bot.findOne({ username });
    if (bot) {
      return res.json({
        success: false,
        message: "Bot username already registered",
      });
    }

    const twitchUser = await fetchUser(username);
    if (!twitchUser) {
      return res.json({
        success: false,
        message: "Username doesn't exist on Twitch",
      });
    }

    res.json({ success: true });
  } catch (error) {
    if (error.message === "Client ID and OAuth token do not match") {
      // Can't check username because wrong twitch token, return true
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
  }
};

const refresh = async (req, res) => {
  const { bot } = req;

  try {
    const jwt = await createAccessToken(bot.id, bot.username);
    const refresh = await createRefreshToken(bot.id, bot.username);

    bot.refresh = refresh;
    await bot.save();

    res.json({ success: true, jwt, refresh, bot: bot.toJSON() });
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  register,
  login,
  logout,
  update,
  available,
  refresh,
};
