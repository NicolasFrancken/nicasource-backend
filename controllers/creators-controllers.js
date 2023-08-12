const { validationResult } = require("express-validator");
const { serialize } = require("cookie");

const HttpError = require("../models/http-error");
const pool = require("../db");
const { generateToken } = require("../middlewares/auth");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid credentials, please try again", 422));
  }

  const { name, email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO creators (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    const token = await generateToken();
    const serialized = serialize("token", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      domain: "localhost",
    });

    res.setHeader("Set-Cookie", serialized);

    res.json(result.rows[0]);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM creators WHERE email = $1 AND password = $2 ",
      [email, password]
    );

    if (result.rows.length === 0) {
      const error = new HttpError("Invalid credentials", 404);
      return next(error);
    }

    const token = await generateToken();
    const serialized = serialize("token", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      domain: "localhost",
    });

    res.setHeader("Set-Cookie", serialized);

    res.json(result.rows[0]);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

exports.signup = signup;
exports.signin = signin;
