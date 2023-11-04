const { default: mongoose } = require("mongoose");
const { adminSchema } = require("../schemas/admin/admin.schema");

module.exports.Admin = mongoose.model("Admin", adminSchema);
