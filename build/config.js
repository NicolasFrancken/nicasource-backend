"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretKey = exports.port = exports.db = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const db = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    postgresDatabase: process.env.DB_POSTGRESDATABASE,
};
exports.db = db;
const port = Number(process.env.PORT);
exports.port = port;
const secretKey = process.env.SECRET_KEY;
exports.secretKey = secretKey;
