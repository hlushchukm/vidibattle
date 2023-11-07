const { Post } = require("../models/post.model");
const { Report } = require("../models/report.model");

module.exports.getReports = async (req, res, next) => {
  try {
    // Get the page number and items per page from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "pending";

    if (status !== "resolved" && status !== "pending" && status !== "ignored") {
      return res.status(400).json({ message: "invalid report status query" });
    }

    // Calculate the skip value based on the page number and limit
    const skip = (page - 1) * limit;

    const reports = await Report.find({ status })
      .populate("reported_by", "first_name last_name profile_img")
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Report.countDocuments({ status }).exec(); // total number of comments
    const totalPages = Math.ceil(totalCount / limit); // total number of pages

    // Return the paginated comments and pagination metadata
    res.json({
      data: reports,
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

module.exports.resolveReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await Post.findByIdAndUpdate(report.post, { is_deleted: true });

    report.status = "resolved";
    await report.save();

    res.status(200).json({ message: "Post has been removed" });
  } catch (e) {
    next(e);
  }
};

module.exports.ignoreReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "ignored";
    await report.save();

    res.status(200).json({ message: "Report has been updated" });
  } catch (e) {
    next(e);
  }
};
