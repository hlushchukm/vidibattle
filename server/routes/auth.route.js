const express = require("express");
const router = express.Router();
const {
  loginController,
  loginSuccess,
  loginFail,
} = require("../controllers/auth");
const passport = require("passport");

router.get("/", (req, res, next) => {
  res.send("Works");
});

router.post("/login", loginController);
router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFail);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/facebook", passport.authenticate("facebook"));
router.get("/instagram", passport.authenticate("instagram"));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    // Successful login, redirect or send a response
    console.log("Successfull Login");
    res.redirect(process.env.CLIENT_URL + "/auth/login/successfull" ?? "");
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login/failed" }),
  (req, res) => {
    // Successful login, redirect or send a response
    console.log("Successfull Facebook Login");
    res.redirect(process.env.CLIENT_URL + "/auth/login/successfull" ?? "");
  }
);

router.get(
  "/instagram/callback",
  passport.authenticate("instagram", { failureRedirect: "/login/failed" }),
  (req, res) => {
    // Successful login, redirect or send a response
    console.log("Successfull Instagram Login");
    res.redirect(process.env.CLIENT_URL + "/auth/login/successfull" ?? "");
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(); // Passport.js logout method
  res.redirect("/");
});

module.exports = router;
