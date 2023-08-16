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
exports.switchFollow = exports.getCreator = exports.getCreators = exports.signin = exports.signup = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = __importDefault(require("../models/http-error"));
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middlewares/auth");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.default("Invalid credentials, please try again", 401));
    }
    const { name, email, password, image } = req.body;
    try {
        const result = yield db_1.default.query("INSERT INTO creators (name, email, password, image) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, password, image]);
        const token = yield (0, auth_1.generateToken)();
        res.json({ result: result.rows[0], token });
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const result = yield db_1.default.query("SELECT * FROM creators WHERE email = $1 AND password = $2 ", [email, password]);
        if (result.rows.length === 0) {
            const error = new http_error_1.default("Invalid credentials", 401);
            return next(error);
        }
        const token = yield (0, auth_1.generateToken)();
        res.json({ result: result.rows[0], token });
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.signin = signin;
const getCreators = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    try {
        const result = yield db_1.default.query("SELECT * FROM creators WHERE id_creator <> $1", [creatorId]);
        if (result.rows.length === 0) {
            const error = new http_error_1.default("No creators found...", 404);
            return next(error);
        }
        res.json({ result: result.rows });
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.getCreators = getCreators;
const getCreator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    try {
        const result = yield db_1.default.query("SELECT * FROM creators WHERE id_creator = $1", [creatorId]);
        if (result.rows.length === 0) {
            const error = new http_error_1.default("Creator not found...", 500);
            return next(error);
        }
        res.json({ result: result.rows[0] });
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.getCreator = getCreator;
const switchFollow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    const { followCreatorId } = req.body;
    try {
        const result = yield db_1.default.query("SELECT * FROM creators WHERE id_creator = $1 AND $2 = ANY(follows)", [creatorId, followCreatorId]);
        if (result.rows.length === 0) {
            try {
                const result = yield db_1.default.query("UPDATE creators SET follows = array_append(follows, $2) WHERE id_creator = $1 RETURNING *", [creatorId, followCreatorId]);
                res.json({ result: result.rows[0] });
            }
            catch (e) {
                const error = new http_error_1.default("There was an error", 500);
                return next(error);
            }
        }
        else {
            try {
                const result = yield db_1.default.query("UPDATE creators SET follows = array_remove(follows, $2) WHERE id_creator = $1 RETURNING *", [creatorId, followCreatorId]);
                res.json({ result: result.rows[0] });
            }
            catch (e) {
                const error = new http_error_1.default("There was an error", 500);
                return next(error);
            }
        }
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.switchFollow = switchFollow;
