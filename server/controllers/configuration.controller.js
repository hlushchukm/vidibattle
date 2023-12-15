const { Configuration } = require("../models/configuration.model");

module.exports.getConfigurations = async (req, res, next) => {
  try {
    let { keys } = req.query;
    let query = {};

    if (keys && Array.isArray(keys)) {
      query = { $in: [...keys] };
    }

    const configurations = await Configuration.find(query);

    res.status(200).json({ data: configurations });
  } catch (e) {
    next(e);
  }
};

module.exports.updateConfiguration = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};
