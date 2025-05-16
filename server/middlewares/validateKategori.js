const { body, validationResult } = require("express-validator");

const validateKategori = [
  body("nama_kategori").trim().escape().notEmpty().withMessage("harus disi"),

  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    next();
  },
];

module.exports = validateKategori;
