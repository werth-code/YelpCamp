const express = require("express"),

  router = express.Router(),
  Campground = require("../models/campground"),
  Comment = require("../models/comment")
  
router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) console.log("Error", err);
    else res.render("comments/new", { campground: campground });
  });
});

router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) res.redirect("/campgrounds");
    else
      Comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;