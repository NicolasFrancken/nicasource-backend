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
exports.likeVideo = exports.deleteVideo = exports.publishVideo = exports.updateVideo = exports.createVideo = exports.getVideoByVideoId = exports.getVideosByCreatorId = exports.getPublishedVideos = void 0;
const http_error_1 = __importDefault(require("../models/http-error"));
const db_1 = __importDefault(require("../db"));
const getPublishedVideos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query("SELECT * FROM videos WHERE published = true");
        res.json(result.rows);
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.getPublishedVideos = getPublishedVideos;
const getVideosByCreatorId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    try {
        const creatorVideos = yield db_1.default.query("SELECT * FROM videos WHERE id_creator = $1", [creatorId]);
        res.json(creatorVideos.rows);
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.getVideosByCreatorId = getVideosByCreatorId;
const getVideoByVideoId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const result = yield db_1.default.query("SELECT * FROM videos WHERE id_video = $1", [videoId]);
        if (result.rows.length === 0) {
            const error = new http_error_1.default("Video not found", 404);
            return next(error);
        }
        res.json(result.rows[0]);
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.getVideoByVideoId = getVideoByVideoId;
const createVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    const { url, title } = req.body;
    try {
        const createdVideo = yield db_1.default.query("INSERT INTO videos (url, title, id_creator) VALUES ($1, $2, $3) RETURNING *", [url, title, creatorId]);
        res.json(createdVideo.rows);
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.createVideo = createVideo;
const updateVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    const { title } = req.body;
    try {
        const result = yield db_1.default.query("UPDATE videos SET title = $1 WHERE id_video = $2 RETURNING *", [title, videoId]);
        if (result.rows.length === 0) {
            const error = new http_error_1.default("Video not found", 404);
            return next(error);
        }
        res.json(result.rows[0]);
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.updateVideo = updateVideo;
const publishVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const result = yield db_1.default.query("UPDATE videos SET published = NOT published WHERE id_video = $1 RETURNING *", [videoId]);
        if (result.rows.length === 0) {
            const error = new http_error_1.default("Video not found", 404);
            return next(error);
        }
        res.json(result.rows[0]);
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.publishVideo = publishVideo;
const deleteVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const result = yield db_1.default.query("DELETE FROM videos WHERE id_video = $1 RETURNING *", [videoId]);
        if (result.rowCount === 0) {
            const error = new http_error_1.default("Video not found", 404);
            return next(error);
        }
        res.sendStatus(204);
    }
    catch (e) {
        const error = new http_error_1.default("There was an error", 500);
        return next(error);
    }
});
exports.deleteVideo = deleteVideo;
const likeVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    const { videoId } = req.body;
    try {
        const result = yield db_1.default.query("SELECT * FROM creators WHERE id_creator = $1 AND $2 = ANY(liked_videos)", [creatorId, videoId]);
        if (result.rows.length === 0) {
            try {
                const result = yield db_1.default.query("UPDATE creators SET liked_videos = array_append(liked_videos, $2) WHERE id_creator = $1 RETURNING *", [creatorId, videoId]);
                res.json({ result: result.rows[0] });
            }
            catch (e) {
                const error = new http_error_1.default("There was an error", 500);
                return next(error);
            }
        }
        else {
            try {
                const result = yield db_1.default.query("UPDATE creators SET liked_videos = array_remove(liked_videos, $2) WHERE id_creator = $1 RETURNING *", [creatorId, videoId]);
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
exports.likeVideo = likeVideo;
