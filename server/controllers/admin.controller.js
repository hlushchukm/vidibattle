const { Admin } = require("../models/admin.model");
const { hash } = require("../services/hash");
const { deleteFile } = require("./media.controller");
const bcrypt = require("bcryptjs");

module.exports.createAdminAccount = async ({
  email,
  first_name,
  last_name,
  password,
}) => {
  try {
    const password_hash = await hash(password);
    const admin = new Admin({
      email,
      first_name,
      last_name,
      password: password_hash,
    });

    await admin.save();
    const response = admin.toObject();
    response.password = password;

    return response;
  } catch (e) {
    next(e);
  }
};

module.exports.getProfileInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const admin = await Admin.findById(_id, "-password -is_admin");

    if (!admin) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ data: admin });
  } catch (e) {
    next(e);
  }
};

module.exports.updateAdminProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, email } = req.body;
    const { _id } = req.user;
    const file = req.file;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        message: "Missing data! First name, last name and email are required",
      });
    }

    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "invalid email pattern" });
    }

    const emailMatch = await Admin.countDocuments({ email, _id: { $ne: _id } });
    if (emailMatch > 0) {
      return res.status(400).json({ message: "email is already taken" });
    }

    const admin = await Admin.findById(_id);

    if (!admin) {
      return res.status(404).json({ message: "admin account not found" });
    }

    if (file) {
      // change profile pic
      await deleteFile(admin.profile_img);
      admin.profile_img = file.filename;
    }

    admin.first_name = first_name;
    admin.last_name = last_name;
    admin.email = email;

    admin.save();

    res.status(200).json({ message: "admin data updated", data: admin });
  } catch (e) {
    next(e);
  }
};

module.exports.changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;
    const { _id } = req.user;

    const admin = await Admin.findById(_id);

    if (!admin) {
      return res.status(404).json({ message: "admin account not found" });
    }

    if (!(await bcrypt.compare(old_password, admin.password))) {
      return res.status(400).json({ message: "incorrect password" });
    }

    const new_password_hash = await hash(new_password);
    admin.password = new_password_hash;
    await admin.save();

    res.status(200).json({ message: "password changed successfully" });
  } catch (e) {
    next(e);
  }
};
