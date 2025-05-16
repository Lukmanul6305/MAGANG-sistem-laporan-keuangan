const { body, validationResult } = require("express-validator");

const validateTransaksi = [
  body("jumlah").notEmpty().withMessage("tidak boleh kosong"),
  body("tanggal").notEmpty().withMessage("tanggal tidak boleh kosong").isISO8601().withMessage("format valid tidak sesuai yyyy-mm-dd"),

  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    next();
  },
];

module.exports = validateTransaksi;
