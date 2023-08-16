import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import HttpError from "../models/http-error";
import pool from "../db";
import { generateToken } from "../middlewares/auth";

const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid credentials, please try again", 401));
  }

  const { name, email, password, image } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO creators (name, email, password, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, image]
    );

    const token = await generateToken();

    res.json({ result: result.rows[0], token });
  } catch (e) {
    const error = new HttpError("There was an error", 500);
    return next(error);
  }
};

const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM creators WHERE email = $1 AND password = $2 ",
      [email, password]
    );

    if (result.rows.length === 0) {
      const error = new HttpError("Invalid credentials", 401);
      return next(error);
    }

    const token = await generateToken();

    res.json({ result: result.rows[0], token });
  } catch (e) {
    const error = new HttpError("There was an error", 500);
    return next(error);
  }
};

const getCreators = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { creatorId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM creators WHERE id_creator <> $1",
      [creatorId]
    );

    if (result.rows.length === 0) {
      const error = new HttpError("No creators found...", 404);
      return next(error);
    }

    res.json({ result: result.rows });
  } catch (e) {
    const error = new HttpError("There was an error", 500);
    return next(error);
  }
};

const getCreator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { creatorId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM creators WHERE id_creator = $1",
      [creatorId]
    );

    if (result.rows.length === 0) {
      const error = new HttpError("Creator not found...", 500);
      return next(error);
    }

    res.json({ result: result.rows[0] });
  } catch (e) {
    const error = new HttpError("There was an error", 500);
    return next(error);
  }
};

const switchFollow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { creatorId } = req.params;
  const { followCreatorId } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM creators WHERE id_creator = $1 AND $2 = ANY(follows)",
      [creatorId, followCreatorId]
    );

    if (result.rows.length === 0) {
      try {
        const result = await pool.query(
          "UPDATE creators SET follows = array_append(follows, $2) WHERE id_creator = $1 RETURNING *",
          [creatorId, followCreatorId]
        );

        res.json({ result: result.rows[0] });
      } catch (e) {
        const error = new HttpError("There was an error", 500);
        return next(error);
      }
    } else {
      try {
        const result = await pool.query(
          "UPDATE creators SET follows = array_remove(follows, $2) WHERE id_creator = $1 RETURNING *",
          [creatorId, followCreatorId]
        );

        res.json({ result: result.rows[0] });
      } catch (e) {
        const error = new HttpError("There was an error", 500);
        return next(error);
      }
    }
  } catch (e) {
    const error = new HttpError("There was an error", 500);
    return next(error);
  }
};

export { signup, signin, getCreators, getCreator, switchFollow };
