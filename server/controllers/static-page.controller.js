const { StaticPage } = require("../models/static-page.model");

module.exports.createPage = async (req, res, next) => {
  try {
    const { pagename, content } = req.body;

    if (!pagename || !content) {
      return res
        .status(400)
        .json({ message: "page name and content are required" });
    }

    const existingPage = await StaticPage.findOne({ pagename });

    if (existingPage) {
      existingPage.content = content;
      await existingPage.save();
      return res.status(201).json({ message: "page created successfully" });
    } else {
      const newPage = new StaticPage({ pagename, content });
      await newPage.save();
      return res
        .status(200)
        .json({ message: "page content updated successfully" });
    }
  } catch (e) {
    next(e);
  }
};

module.exports.getPage = async (req, res, next) => {
  try {
    const { pagename } = req.params;

    const page = await StaticPage.findOne({ pagename });


    return res.status(200).json({ data: page ?? "" });
  } catch (e) {
    next(e);
  }
};
