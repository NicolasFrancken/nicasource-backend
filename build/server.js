"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const http_error_1 = __importDefault(require("./models/http-error"));
const videos_routes_1 = __importDefault(require("./routes/videos-routes"));
const creators_routes_1 = __importDefault(require("./routes/creators-routes"));
const auth_1 = require("./middlewares/auth");
const createDatabase_1 = require("./createDatabase");
const app = (0, express_1.default)();
app.use("*", (0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/creators", creators_routes_1.default);
app.use("/api/videos", auth_1.verifyToken, videos_routes_1.default);
app.use((req, res, next) => {
    next(new http_error_1.default("Could not find this route", 404));
});
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});
(0, createDatabase_1.createDatabase)()
    .then(() => {
    app.listen(config_1.port || 5000, () => {
        console.log("listening");
    });
})
    .catch((e) => {
    console.error("There was an error", e);
});
