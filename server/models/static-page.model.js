const { default: mongoose } = require("mongoose");
const { staticPageSchema } = require("../schemas/static-page.schema");

module.exports.StaticPage = mongoose.model("StaticPage", staticPageSchema);
