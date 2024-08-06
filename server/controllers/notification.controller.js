const createHttpError = require("http-errors");
const { User } = require("../models/user.model");
const { Notification } = require("../models/notification.model");

module.exports.sendNotification = async (req, res, next) => {

    const { to, title, description, creator } = req.body

    const user = await User.findById(req.user._id);

    if (!user) {
        throw createHttpError(404, "user not found");
    }

    notificationCreator(req, to, title, description, creator);

    res.status(201).json({ message: "notification created successfully" });
};

module.exports.createNotification = async ({
    req, to, title, description, creator
}) => {
    return await notificationCreator({
        req, to, title, description, creator
    });
};

async function notificationCreator({ req, to, title, description, creator }) {

    const notificationExist = await Notification.findOne(
        {
            $and: [{ to: to },
            { creator: creator },
            { title: title }]
        }
    )

    if (!notificationExist) {
        const notification = new Notification({
            to: to,
            title: title,
            description: description,
            creator: creator,
        });

        await notification.save();

        const notificationData = await notification.populate(
            "to creator",
            "first_name last_name username profile_img email contact_no socket_id"
        );

        req.io.to(notificationData.to.socket_id).emit('NEW_NOTIFICATION', notificationData);

        return notificationData;
    } else {
        return
    }

}

module.exports.getNotifications = async (req, res, next) => {
    try {
        const { _id } = req.user;

        const notification = await Notification.find({ $or: [{ to: _id }, { creator: _id }] }).populate(
            "to creator",
            "first_name last_name username profile_img email contact_no socket_id"
        ).sort({ createdAt: -1 });

        if (!notification) {
            return res.status(404).json({ message: "notification not found" });
        }

        res.status(200).json({ data: notification });
    } catch (e) {
        next(e);
    }
};

module.exports.getUnseenNotificationsTotal = async (req, res, next) => {
    try {
        const { _id } = req.user;

        let queryUnseenNoti = Notification.find({ $or: [{ to: _id }, { creator: _id }], read: false }).sort({ createdAt: -1 });
        const unSeen = await queryUnseenNoti;
        
        res.status(200).json({ data: unSeen.length });
    } catch (e) {
        next(e);
    }
};

module.exports.markNotification = async (req, res, next) => {

    const { id } = req.params;

    const notification = await Notification.findOne({ _id: id });

    if (!notification) return res.sendStatus(404);

    notification.read = true;

    await notification.save();

    const notificationData = await notification.populate(
        "to creator",
        "first_name last_name username profile_img email contact_no socket_id"
    );

    req.io.to(notificationData.to.socket_id).emit('READ_NOTIFICATION', notificationData);

    res.sendStatus(200);
};