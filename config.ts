import { config } from "dotenv";
config();

const db = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_DATABASE!,
  postgresDatabase: process.env.DB_POSTGRESDATABASE!,
};

const port = Number(process.env.PORT!);
const secretKey = process.env.SECRET_KEY!;

export { db, port, secretKey };
