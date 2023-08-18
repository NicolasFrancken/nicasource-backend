"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    // user: db.user,
    // password: db.password,
    // host: db.host,
    // port: db.port,
    // database: db.database,
    user: "nico",
    password: "LV4nmfFels9Ke3TvvLmdlmvpjhGFKktv",
    host: "dpg-cjf5rpgcfp5c73fkvu1g-a",
    port: 5432,
    database: "nicasourcedb",
});
exports.default = pool;
