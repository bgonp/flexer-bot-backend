const { validationResult } = require("express-validator");

const fieldsValidator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors.map((error) => error.msg).join(", ");
    return res.json({ success: false, message });
  }

  next();
};

module.exports = { fieldsValidator };
