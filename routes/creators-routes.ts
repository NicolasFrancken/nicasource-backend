import express from "express";
import { check } from "express-validator";

import * as creatorsControllers from "../controllers/creators-controllers";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

const { signup, signin, getCreators, getCreator, switchFollow } = creatorsControllers;

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

router.get("/:creatorId", verifyToken, getCreators);

router.get("/creator/:creatorId", verifyToken, getCreator);

router.put("/follow/:creatorId", verifyToken, switchFollow);

export default router;
