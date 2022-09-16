const jwt = require("jsonwebtoken");
const duration = "30d";

exports.createJWT = (user) => {
  return jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: duration,
  });
};
