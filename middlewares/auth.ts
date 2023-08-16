import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import { secretKey } from "../config";

const generateToken = (): string => {
  try {
    const token = jwt.sign({}, secretKey) as string;
    return token;
  } catch (e) {
    throw new HttpError("Something went wrong", 401);
  }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = await req.cookies._auth;

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

export { generateToken, verifyToken };
