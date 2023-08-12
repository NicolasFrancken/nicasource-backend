const express = require("express");
const { check } = require("express-validator");

const creatorsControllers = require("../controllers/creators-controllers");

const router = express.Router();

const { signup, signin } = creatorsControllers;

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail({ gmail_remove_dots: false }).isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  signup
);

router.post(
  "/signin",
  [check("email").normalizeEmail({ gmail_remove_dots: false })],
  signin
);

module.exports = router;
