const { body, validationResult } = require("express-validator");

const validateUser = [
  body("username").trim().escape().notEmpty().withMessage("username harus disi"),
  body("email").trim().escape().isEmail().withMessage("email tidak valid"),
  body("password").trim().escape().isLength({ min: 6 }).withMessage("minimal 6 karakter"),

  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    next();
  },
];

module.exports = validateUser;
