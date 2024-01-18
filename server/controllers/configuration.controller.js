const { Configuration } = require("../models/configuration.model");
const { deleteFile } = require("./media.controller");

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
    const { data: strData } = req.body;
    const data = JSON.parse(strData);

    const loading_screen_image = req.files["loading_screen_image"]?.[0];
    const home_bgd_desktop = req.files["home_bgd_desktop"]?.[0];
    const home_bgd_mobile = req.files["home_bgd_mobile"]?.[0];

    if (!data) {
      return res.status(400).json({ message: "couldn't find data" });
    }

    for (const key in data) {
      let value = data[key]?.value;
      switch (key) {
        case "home_bgd_desktop":
          if (home_bgd_desktop) {
            value = home_bgd_desktop.filename;
          }
          await this.deleteExistingConfigurationFile(key, value);
          break;
        case "home_bgd_mobile":
          if (home_bgd_mobile) {
            value = home_bgd_mobile.filename;
          }
          await this.deleteExistingConfigurationFile(key, value);
          break;
        case "loading_screen_image":
          if (loading_screen_image) {
            value = loading_screen_image.filename;
          }
          await this.deleteExistingConfigurationFile(key, value);
          break;
        default:
          value = data[key]?.value;
          break;
      }

      await Configuration.findOneAndUpdate(
        { key },
        {
          key,
          value,
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

module.exports.deleteExistingConfigurationFile = async (key, newFileName) => {
  const existingRecord = await Configuration.findOne({ key });
  if (existingRecord && existingRecord.value !== newFileName) {
    // delete the old file
    await deleteFile(existingRecord.value);
  }
};
