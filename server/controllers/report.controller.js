const { Report } = require("../models/report.model");

module.exports.getReports = async (req, res, next) => {
  try {
    // Get the page number and items per page from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the skip value based on the page number and limit
    const skip = (page - 1) * limit;

    const reports = await Report.find()
      .populate("reported_by", "first_name last_name profile_img")
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Report.countDocuments().exec(); // total number of comments
    const totalPages = Math.ceil(totalCount / limit); // total number of pages

    // Return the paginated comments and pagination metadata
    res.json({
      reports,
      page,
      limit,
      totalCount,
      totalPages,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.createReport = async (req, res, next) => {
  try {
    const { post, comment } = req.body;
    const { _id: reported_by } = req.user;

    const report = new Report({ post, reported_by, comment });
    await report.save();

    res.status(201).json({ data: report });
  } catch (e) {
    next(e);
  }
};
