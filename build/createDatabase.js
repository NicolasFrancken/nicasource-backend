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
const config_1 = require("./config");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
function createDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool({
            user: config_1.db.user,
            password: config_1.db.password,
            host: config_1.db.host,
            port: config_1.db.port,
            database: config_1.db.postgresDatabase,
        });
        try {
            const result = yield pool.query("SELECT datname FROM pg_database WHERE datname = $1", ["nicasourcedb"]);
            if (result.rows.length === 0) {
                yield pool.query(`CREATE DATABASE nicasourcedb`);
            }
            const newPool = new pg_1.Pool({
                user: config_1.db.user,
                password: config_1.db.password,
                host: config_1.db.host,
                port: config_1.db.port,
                database: config_1.db.database,
            });
            const secondResult = yield newPool.query(`
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'creators'
    );
  `);
            if (secondResult.rows[0].exists === true) {
                newPool.end();
                return;
            }
            else {
                const sqlScriptPath = path_1.default.join(__dirname, "./database/db.sql");
                const sqlScript = yield promises_1.default.readFile(sqlScriptPath, "utf8");
                yield newPool.query(sqlScript);
                newPool.end();
            }
        }
        catch (e) {
            console.log("There was an error", e);
        }
        finally {
            pool.end();
        }
    });
}
exports.createDatabase = createDatabase;
