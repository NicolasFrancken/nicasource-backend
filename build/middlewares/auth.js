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
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = __importDefault(require("../models/http-error"));
const config_1 = require("../config");
const generateToken = () => {
    try {
        const token = jsonwebtoken_1.default.sign({}, config_1.secretKey);
        return token;
    }
    catch (e) {
        throw new http_error_1.default("Something went wrong", 401);
    }
};
exports.generateToken = generateToken;
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield req.cookies._auth;
    if (!token) {
        return next(new http_error_1.default("Access denied", 401));
    }
    try {
        jsonwebtoken_1.default.verify(token, config_1.secretKey);
        next();
    }
    catch (e) {
        return next(new http_error_1.default("Invalid Token", 401));
    }
});
exports.verifyToken = verifyToken;
