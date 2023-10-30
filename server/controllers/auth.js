const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

function loginController(req, res) {
  res.send("Post workss");
}

// TODO: remove login success and fail controllers if they are going to be unused
function loginSuccess(req, res) {
  console.log(req);
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
}

function loginFail(req, res) {
  console.log("Fail");
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
}

module.exports = {
  loginController,
  loginSuccess,
  loginFail,
};
