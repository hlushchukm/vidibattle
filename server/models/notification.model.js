const mongoose = require("mongoose");
const { notificationSchema } = require("../schemas/notification.schema");

module.exports.Notification = mongoose.model("Notification", notificationSchema);
