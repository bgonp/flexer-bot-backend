const { Router } = require("express");
const { check } = require("express-validator");
const { register, login, refresh } = require("../controllers/auth");
const { fieldsValidator } = require("../middlewares/fieldsValidator");
const { verifyJwt } = require("../middlewares/verifyJwt");

const router = Router();

router.post(
  "/register",
  [
    check("email", "Wrong email").isEmail(),
    check("password", "Short password").isLength({ min: 6 }),
    fieldsValidator,
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Wrong email").isEmail(),
    check("password", "Short password").isLength({ min: 6 }),
    fieldsValidator,
  ],
  login
);

router.post("/refresh", verifyJwt, refresh);

module.exports = router;
