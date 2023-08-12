const pool = require("../db");

const HttpError = require("../models/http-error");

const getPublishedVideos = async (req, res, next) => {
  try {
    const allPublishedVideos = await pool.query(
      "SELECT * FROM videos WHERE published = false" //CAMBIAR ESTO A TRUEEEEEEEEEEEEEE
    );

    res.json(allPublishedVideos.rows);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

const getVideosByCreatorId = async (req, res, next) => {
  const { creatorId } = req.params;
  try {
    const creatorVideos = await pool.query(
      "SELECT * FROM videos WHERE id_creator = $1",
      [creatorId]
    );

    res.json(creatorVideos.rows);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

const getVideoByVideoId = async (req, res, next) => {
  const { videoId } = req.params;

  try {
    const video = await pool.query("SELECT * FROM videos WHERE id_video = $1", [
      videoId,
    ]);

    if (video.rows.length === 0) {
      const error = new HttpError("Video not found", 404);
      return next(error);
    }

    res.json(video.rows);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

const createVideo = async (req, res, next) => {
  const { creatorId } = req.params;
  const { url, title } = req.body;

  try {
    const createdVideo = await pool.query(
      "INSERT INTO videos (url, title, id_creator) VALUES ($1, $2, $3) RETURNING *", // con esto le digo "inserta en la tabla videos los datos url y title, y devolve (RETURNING) lo creado"
      [url, title, creatorId]
    );

    res.json(createdVideo.rows);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

const updateVideo = async (req, res, next) => {
  const { videoId } = req.params;
  const { title } = req.body;

  try {
    const updatedVideo = await pool.query(
      "UPDATE videos SET title = $1 WHERE id_video = $2 RETURNING *",
      [title, videoId]
    );

    if (updatedVideo.rows.length === 0) {
      const error = new HttpError("Video not found", 404);
      return next(error);
    }

    res.json(updatedVideo.rows);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

const publishVideo = async (req, res, next) => {
  const { videoId } = req.params;

  try {
    const result = await pool.query(
      "UPDATE videos SET published = !published WHERE id_video = $1",
      [videoId]
    );

    if (result.rows.length === 0) {
      const error = new HttpError("Video not found", 404);
      return next(error);
    }

    res.json();
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

const deleteVideo = async (req, res, next) => {
  const { videoId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM videos WHERE id_video = $1 RETURNING *",
      [videoId]
    );

    if (result.rowCount === 0) {
      const error = new HttpError("Video not found", 404);
      return next(error);
    }

    res.sendStatus(204);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
};

exports.getPublishedVideos = getPublishedVideos;
exports.getVideosByCreatorId = getVideosByCreatorId;
exports.getVideoByVideoId = getVideoByVideoId;
exports.createVideo = createVideo;
exports.updateVideo = updateVideo;
exports.publishVideo = publishVideo;
exports.deleteVideo = deleteVideo;
