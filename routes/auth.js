const { Router } = require("express");
const { check } = require("express-validator");
const {
  register,
  login,
  refresh,
  logout,
  update,
  available,
} = require("../controllers/auth");
const { fieldsValidator } = require("../middlewares/fieldsValidator");
const { verifyAccess, verifyRefresh } = require("../middlewares/verifyJwt");

const router = Router();

router.post(
  "/register",
  [
    check("username", "Bot username required").notEmpty(),
    check("password", "Short password").isLength({ min: 6 }),
    check("token", "Twitch token required").notEmpty(),
    check("channel", "Channel name required").notEmpty(),
    fieldsValidator,
  ],
  register
);

router.post(
  "/login",
  [
    check("username", "Bot username required").notEmpty(),
    check("password", "Short password").isLength({ min: 6 }),
    fieldsValidator,
  ],
  login
);

router.post(
  "/logout",
  [check("id", "Bot id required").notEmpty(), fieldsValidator],
  logout
);

router.put(
  "/update",
  [
    verifyAccess,
    check("id", "Bot ID required").notEmpty(),
    check("token", "Token required").notEmpty(),
    check("channel", "Channel required").notEmpty(),
    fieldsValidator,
  ],
  update
);

router.get(
  "/available",
  [check("username", "Bot username required").notEmpty(), fieldsValidator],
  available
);

router.get("/refresh", verifyRefresh, refresh);

module.exports = router;
