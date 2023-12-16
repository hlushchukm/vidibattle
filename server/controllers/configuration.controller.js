const { Configuration } = require("../models/configuration.model");

module.exports.getConfigurations = async (req, res, next) => {
  try {
    let { keys } = req.query;
    let query = {};

    if (keys && Array.isArray(keys)) {
      query = { key: { $in: [...keys] } };
    }

    const configurations = await Configuration.find(query);

    res.status(200).json({ data: configurations });
  } catch (e) {
    next(e);
  }
};

module.exports.updateConfiguration = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "couldn't find data" });
    }

    for (const key in data) {
      await Configuration.findOneAndUpdate(
        { key },
        {
          key,
          value: data[key]?.value,
          unit: data[key]?.unit,
          metadata: data[key]?.metadata,
        },
        {
          upsert: true, // Create a new document if not found
          new: true, // Return the updated document
        }
      );
    }

    res
      .status(200)
      .json({ message: "configuration data updated successfully" });
  } catch (e) {
    next(e);
  }
};
