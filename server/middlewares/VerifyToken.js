// const jwt = require("jsonwebtoken");

// exports.verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) return res.sendStatus(403);
//     req.email = decoded.email;
//     req.user_id = decoded.userId;
//     next();
//   });
// };

const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    // Simpan informasi user di req
    req.user = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    };

    next();
  });
};
