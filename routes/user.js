const express = require("express");
const router = express.Router();
const MyError = require("../utilities/MyError.js");
const wrapAsync = require("../utilities/WrapAsync.js");
const User = require("../models/user.js");
const flash = require("connect-flash");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registerdUser = await User.register(newUser, password);
      req.flash("success", "Wellcome To Wanderlust!");
      res.redirect("/listing");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    async (req, res) => {
      req.flash("success","Wellcome Back! logged in wanderlust!");
      res.redirect("/listing");
    }
  );
module.exports = router;
