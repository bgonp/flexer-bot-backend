const bcrypt = require("bcryptjs");
const { createJwt } = require("../helpers/jwt");
const User = require("../models/User");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "Email address already registered",
      });
    }

    const salt = bcrypt.genSaltSync();
    hashedPassword = bcrypt.hashSync(password, salt);

    user = new User({ email, password: hashedPassword });

    await user.save();

    const jwt = await createJwt(user.id, user.email);

    res.json({ success: true, jwt, user: user.toJSON() });
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const validPassword = user && bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.json({ success: false, message: "Wrong credentials" });
    }
    const jwt = await createJwt(user.id, user.email);

    res.json({ success: true, jwt, user: user.toJSON() });
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
};

const refresh = async (req, res) => {
  const { id, email } = req;

  try {
    const jwt = await createJwt(id, email);
    const user = await User.findOne({ email });

    res.json({ success: true, jwt, user: user.toJSON() });
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  login,
  refresh,
};
