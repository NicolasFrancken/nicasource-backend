import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { port } from "./config";
import HttpError from "./models/http-error";
import videosRoutes from "./routes/videos-routes";
import creatorsRoutes from "./routes/creators-routes";
import { verifyToken } from "./middlewares/auth";
import { createDatabase } from "./createDatabase";

const app: Express = express();

app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/creators", creatorsRoutes);
app.use("/api/videos", verifyToken, videosRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpError("Could not find this route", 404));
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

createDatabase()
  .then(() => {
    app.listen(port || 5000, () => {
      console.log("listening");
    });
  })
  .catch((e: Error) => {
    console.error("There was an error", e);
  });