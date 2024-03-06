const express = require("express");
const router = express.Router();
const {
  loginController,
  loginSuccess,
  loginFail,
  unpaidController,
  paidController,
} = require("../controllers/auth");
const passport = require("passport");

router.get("/", (req, res, next) => {
  res.send("Works");
});

router.post("/login", loginController);
router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFail);
router.post("/unpaid", unpaidController);
router.post("/paid", paidController);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/facebook", passport.authenticate("facebook"));
router.get("/instagram", passport.authenticate("instagram"));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login/failed",
  }),
  (req, res) => {
    // Successful login, redirect or send a response
    res.redirect(process.env.CLIENT_URL + "/auth/login/successfull" ?? "");
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/api/auth/login/failed",
  }),
  (req, res) => {
    // Successful login, redirect or send a response
    res.redirect(process.env.CLIENT_URL + "/auth/login/successfull" ?? "");
  }
);

router.get(
  "/instagram/callback",
  passport.authenticate("instagram", {
    failureRedirect: "/api/auth/login/failed",
  }),
  (req, res) => {
    // Successful login, redirect or send a response
    console.log("Successfull Instagram Login");
    res.redirect(process.env.CLIENT_URL + "/auth/login/successfull" ?? "");
  }
);

router.post("/admin/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, message) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({ success: false, message });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      const response = user.toObject();
      delete response.password;
      return res.send({
        success: true,
        data: response,
      });
    });
  })(req, res, next);
});

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});

module.exports = router;
