const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user")

//Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

//Register Form Route
router.get("/register", (req, res) => {
  res.render("register");
});

//Sign In Logic
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

//Log In Form Route
router.get("/login", (req, res) => {
  res.render("login");
});

//Log In Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

module.exports = router;