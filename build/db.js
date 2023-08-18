"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("./config");
const pool = new pg_1.Pool({
    user: config_1.db.user,
    password: config_1.db.password,
    host: config_1.db.host,
    port: config_1.db.port,
    database: config_1.db.database,
});
exports.default = pool;
