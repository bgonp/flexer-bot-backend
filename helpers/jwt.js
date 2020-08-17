const jwt = require("jsonwebtoken");

const createJwt = (id, email) => {
  return new Promise((resolve, reject) => {
    const payload = { id, email };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      },
      (error, token) => {
        if (error) {
          console.error(error);
          reject("Couldn't create JWT");
        }
        resolve(token);
      }
    );
  });
};

module.exports = { createJwt };
