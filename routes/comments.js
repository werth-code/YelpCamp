const express = require("express"),
  router = express.Router({mergeParams: true}),
  Campground = require("../models/campground"),
  Comment = require("../models/comment")
  
//Comments New 
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) console.log("Error", err);
    else res.render("comments/new", { campground: campground });
  });
});

//Comments Create
router.post("/", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) res.redirect("/campgrounds");
    else
      Comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()

          campground.comments.push(comment);
          campground.save();
          console.log(comment)
          res.redirect("/campgrounds/" + campground._id);
        }
      });
  });
});

//Comments Edit Route

router.get("/:comment_id/edit", checkCommentOwnership, ( req, res ) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err) res.redirect("back")
    else {
      res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
    }
  })
})

//Comments Update Route

router.put("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComments) => {
    if (err) res.redirect("back")
    else res.redirect("/campgrounds/" + req.params.id)
  })
})

//Comments Destroy Route

router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err) res.redirect("back")
    else res.redirect("/campgrounds/" + req.params.id)
  })
})

//Middleware

//Make Sure Authorized To Edit!
function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) res.redirect("back");
        else {
          if (foundComment.author.id.equals(req.user._id)) { //Special mongoose method!
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else res.redirect("back");
  }

//Make Sure User Is Logged In!
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;