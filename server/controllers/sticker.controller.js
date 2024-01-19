const createHttpError = require("http-errors");
const { Sticker } = require("../models/sticker.model");
const { deleteFile } = require("./media.controller");

module.exports.getStickersList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Sticker.countDocuments({ competition: null });

    const stickers = await Sticker.find({ competition: null })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: stickers,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.createSticker = async (req, res, next) => {
  try {
    const { type, position, usage_limit } = req.body;
    const file = req.file;

    if (!type || !position || !file || usage_limit === undefined) {
      return res.status(400).json({
        message: "type, position, image and usage limit are required",
      });
    }

    if (type !== "small" && type !== "full-line") {
      return res.status(400).json({ message: "invalid sticker type" });
    }

    if (
      type === "small" &&
      !["top-left", "top-right", "bottom-left", "bottom-right"].includes(
        position
      )
    ) {
      return res.status(400).json({ message: "invalid position type" });
    }

    if (type === "full-line" && !["top", "bottom"].includes(position)) {
      return res.status(400).json({ message: "invalid position type" });
    }

    const newSticker = new Sticker({
      image: file.filename,
      type,
      position,
      competition: null,
      usage_limit,
    });

    await newSticker.save();

    res
      .status(200)
      .json({ message: "sticker created successfully", data: newSticker });
  } catch (e) {
    next(e);
  }
};

module.exports.deleteSticker = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Sticker.deleteOne({ _id: id });

    res.status(204).json({ message: "sticker deleted successfully" });
  } catch (e) {
    next(e);
  }
};

module.exports.getRandomSticker = async (
  competitionId = null,
  for_video = false
) => {
  let query = { competition: competitionId };
  if (for_video) {
    query.$expr = { $lt: ["$usage_count", "$usage_limit"] };
  }

  let count = await Sticker.countDocuments(query);
  if (!count) {
    query.competition = null;
    count = await Sticker.countDocuments(query);
  }

  if (!count) {
    return null;
  }

  const randomNumber = Math.floor(Math.random() * count);

  const stickers = await Sticker.find(query).skip(randomNumber).limit(1);

  return stickers[0];
};

module.exports.createMultipleStickers = async (
  stickers,
  stickerImages,
  competitionId = null
) => {
  const newStickers = [];

  for (const s of stickers) {
    const image = stickerImages[s.index];

    if (!s.type || !s.position || !image) {
      throw createHttpError(400, "type, position and image are required");
    }

    if (s.type !== "small" && s.type !== "full-line") {
      return create(400, "invalid sticker type");
    }

    if (
      s.type === "small" &&
      !["top-left", "top-right", "bottom-left", "bottom-right"].includes(
        s.position
      )
    ) {
      return create(400, "invalid position type");
    }

    if (s.type === "full-line" && !["top", "bottom"].includes(s.position)) {
      return create(400, "invalid position type");
    }

    newStickers.push({
      image: image.filename,
      type: s.type,
      position: s.position,
      competition: competitionId,
      usage_limit: s.usage_limit,
    });
  }

  await Sticker.insertMany(newStickers);
};

module.exports.updateMultipleStickers = async (stickers, stickerImages) => {
  for (const s of stickers) {
    if (!s._id) {
      throw createHttpError(400, "old sticker id not found");
    }

    if (!s.type || !s.position) {
      throw createHttpError(400, "type, position and image are required");
    }

    if (s.type !== "small" && s.type !== "full-line") {
      return create(400, "invalid sticker type");
    }

    if (
      s.type === "small" &&
      !["top-left", "top-right", "bottom-left", "bottom-right"].includes(
        s.position
      )
    ) {
      return create(400, "invalid position type");
    }

    if (s.type === "full-line" && !["top", "bottom"].includes(s.position)) {
      return create(400, "invalid position type");
    }

    const oldSticker = await Sticker.findById(s._id);

    if (!oldSticker) {
      return create(404, "old sticker not found");
    }

    oldSticker.type = s.type;
    oldSticker.position = s.position;
    oldSticker.usage_limit = s.usage_limit;

    if (s.index !== undefined) {
      const image = stickerImages[s.index];

      // delete old sticker image file from gridfs
      if (image) {
        await deleteFile(oldSticker.image);
        oldSticker.image = image.filename;
      }
    }

    await oldSticker.save();
  }
};

module.exports.decrementStickerCount = async (stickerId) => {
  const sticker = await Sticker.findById(stickerId);
  if (!sticker) return null;

  sticker.usage_count = sticker.usage_count - 1;
  if (sticker.usage_count < 0) sticker.usage_count = 0;

  await sticker.save();
  return sticker;
};
