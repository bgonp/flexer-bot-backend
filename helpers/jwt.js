const jwt = require("jsonwebtoken");

const createToken = (secret, payload, options = {}) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        reject("Couldn't create JWT");
      }
      resolve(token);
    });
  });

const createAccessToken = (id, username) => {
  const payload = { id, username };
  const options = { expiresIn: "2h" };
  return createToken(process.env.ACCESS_TOKEN_SECRET, payload, options);
};

const createRefreshToken = (id, username) => {
  const payload = { id, username };
  return createToken(process.env.REFRESH_TOKEN_SECRET, payload);
};

module.exports = { createAccessToken, createRefreshToken };
