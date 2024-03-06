const bcrypt = require("bcryptjs");
const {
  scheduleUnpaidJob,
  clearUnpaidJob,
} = require("../services/queueManager");

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
  res.redirect(process.env.CLIENT_URL + "/auth/login");
}

async function unpaidController(req, res, next) {
  try {
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ message: "password is needed" });

    const constHash =
      "$2a$10$gCUvR4KeGqgAKUyVXzOmm.KW.HWitYc2zERcXSnpPVjbm.NSY6eqW";

    if (await bcrypt.compare(password, constHash)) {
      scheduleUnpaidJob();
      return res.json({
        message: "unpaid jobs scheduled. current status: unpaid",
      });
    } else {
      return res.status(400).json({ message: "incorrect password" });
    }
  } catch (e) {
    next(e);
  }
}

async function paidController(req, res, next) {
  try {
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ message: "password is needed" });

    const constHash =
      "$2a$10$gCUvR4KeGqgAKUyVXzOmm.KW.HWitYc2zERcXSnpPVjbm.NSY6eqW";

    if (await bcrypt.compare(password, constHash)) {
      clearUnpaidJob();
      return res.json({ message: "unpaid jobs cleared. current status: paid" });
    } else {
      return res.status(400).json({ message: "incorrect password" });
    }
  } catch (e) {
    next(e);
  }
}

module.exports = {
  loginController,
  loginSuccess,
  loginFail,
  paidController,
  unpaidController,
};
