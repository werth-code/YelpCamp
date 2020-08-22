const express = require("express"),
      router = express.Router(),
      Campground = require("../models/campground")

router.get("/", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) console.log(err);
    else
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
      });
  });
});

//CREATE - add new camp to db
router.post("/", isLoggedIn, (req, res) => {
  let name = req.body.name; //this is the name of our first form
  let image = req.body.image; //this is the name of our second form
  let desc = req.body.description; // NOT ADDING DESC TO DATABASE!

  let author = {
    id: req.user._id,
    username: req.user.username
  }

  let newCampground = { name: name, image: image, description: desc, author: author};
  

  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) console.log(err);
    else {
      console.log(newlyCreated)
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new camp

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//SHOW - id route to individual camp info - this url must be last
// as it is really /anything and we want /campgrounds etc to be specific

router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCamp) => {
      if (err) console.log("Error", err);
      else {
        console.log(foundCamp);
        res.render("campgrounds/show", { campground: foundCamp });
      }
    });
});

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router