const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { INVALID_CREDENTIALS } = require("../utils/errors");

const handleAuthError = (res) => {
  res.status(INVALID_CREDENTIALS).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    handleAuthError(res);
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    handleAuthError(res);
    return;
  }

  req.user = payload;

  next();
};
