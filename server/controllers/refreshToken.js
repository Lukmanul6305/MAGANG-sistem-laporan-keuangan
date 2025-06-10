const users = require("../models/userModel");
const jwt = require("jsonwebtoken");


exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) return res.sendStatus(401); // unauthorized

    const user = await users.findAll({ where: { refresh_token: refreshToken } });
    if (!user[0]) return res.sendStatus(403); // forbidden

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const userId = user[0].id;
      const name = user[0].username;
      const email = user[0].email;

      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {});
      res.json({ accessToken });
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
