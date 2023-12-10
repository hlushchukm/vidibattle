const { Sticker } = require("../models/sticker.model");

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
    const { type, position } = req.body;
    const file = req.file;

    if (!type || !position || !file) {
      return res
        .status(400)
        .json({ message: "type, position and file are required" });
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

    if (type === "full-line" && !["top", "bootom"].includes(position)) {
      return res.status(400).json({ message: "invalid position type" });
    }

    const newSticker = new Sticker({
      name: file.filename,
      type,
      position,
      competition: null,
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

module.exports.getRandomSticker = async (competitionId = null) => {
  const count = await Sticker.countDocuments({ competition: competitionId });

  if (!count) {
    return null;
  }

  const randomNumber = Math.floor(Math.random() * count);

  const stickers = await Sticker.find({ competition: competitionId })
    .skip(randomNumber)
    .limit(1);

  return stickers[0];
};
