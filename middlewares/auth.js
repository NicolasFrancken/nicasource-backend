const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const { secretKey } = require("../config");
const { serialize } = require("cookie");

const generateToken = () => {
  try {
    const token = jwt.sign({}, secretKey);
    return token;
  } catch (e) {
    return next(new HttpError("Something went wrong", 401));
  }
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new HttpError("Access denied", 401));
  }

  try {
    jwt.verify(token, secretKey);
    next();
  } catch (e) {
    return next(new HttpError("Invalid Token", 401));
  }
};

const renewToken = (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return next(new HttpError("Access denied", 401));
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const expirationTime = decodedToken.exp * 1000;

    const now = Date.now();
    const renewalThreshold = 5 * 60 * 1000;

    if (expirationTime - now <= renewalThreshold) {
      const newToken = jwt.sign({}, secretKey, { expiresIn: "1h" });

      const serialized = serialize("token", newToken, {
        maxAge: 3600000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        domain: "localhost",
      });

      res.setHeader("Set-Cookie", serialized);
    }
  } catch (e) {
    return next(new HttpError("Something went wrong", 401));
  }
};

exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.renewToken = renewToken;
