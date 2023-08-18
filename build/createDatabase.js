"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabase = void 0;
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
function createDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // const pool = new Pool({
        //   // user: db.user,
        //   // password: db.password,
        //   // host: db.host,
        //   // port: db.port,
        //   // database: db.postgresDatabase,
        //   user: "nico",
        //   password: "LV4nmfFels9Ke3TvvLmdlmvpjhGFKktv",
        //   host: "dpg-cjf5rpgcfp5c73fkvu1g-a",
        //   port: 5432,
        //   database: "nicasourcedb",
        // });
        try {
            //   const result = await pool.query(
            //     "SELECT datname FROM pg_database WHERE datname = $1",
            //     ["nicasourcedb"]
            //   );
            //   if (result.rows.length === 0) {
            //     await pool.query(`CREATE DATABASE nicasourcedb`);
            //   } else {
            //     return;
            //   }
            const newPool = new pg_1.Pool({
                user: "nico",
                password: "LV4nmfFels9Ke3TvvLmdlmvpjhGFKktv",
                host: "dpg-cjf5rpgcfp5c73fkvu1g-a",
                port: 5432,
                database: "nicasourcedb",
            });
            const sqlScriptPath = path_1.default.join(__dirname, "./database/db.sql");
            const sqlScript = yield promises_1.default.readFile(sqlScriptPath, "utf8");
            yield newPool.query(sqlScript);
            newPool.end();
        }
        catch (e) {
            console.log("There was an error", e);
        }
    });
}
exports.createDatabase = createDatabase;
