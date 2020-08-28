//All of the middleware
const Campground = require("../models/campground")
const Comment = require("../models/comment")
const middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
          req.flash("error", "Campground Not Found!")
          res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You Don't Have Permission To Do That!")
          res.redirect("back");
        }
      }
    });
  } else res.redirect("back");
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
          req.flash("error", "You Must Log In First!");
          res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          //Special mongoose method!
          next();
        } else {
          req.flash("error", "You Don't Have Permission To Do That!");
          res.redirect("back");
        }
      }
    });
  } else res.redirect("back");
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You Need To Be Logged In To Do That!")
  res.redirect("/login");
}


module.exports = middlewareObj