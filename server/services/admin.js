const { createAdminAccount } = require("../controllers/admin.controller");
const { Admin } = require("../models/admin.model");

module.exports.checkAdminAccount = async () => {
  const count = await Admin.countDocuments();

  if (!count) {
    console.log("no admin account found. creating a new one");
    const newAccount = await createAdminAccount({
      email: "rektech.uk@gmail.com",
      first_name: "Rek",
      last_name: "Tech",
      password: process.env.ADMIN_SEED_PASS,
    });
    console.log("new admin account created: ", newAccount);
  }
};
