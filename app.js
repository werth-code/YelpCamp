const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground.js"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds"),
  port = 3000;

const commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes = require("./routes/index")
      

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Connected to DB!")).catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB()

//Passport Config
app.use(require("express-session")({
  secret: "peter piper picked a peck of pickled peppers",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//This is middlewear to add this variable to ALL routes!
app.use( (req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use(indexRoutes)
app.use("/campgrounds", campgroundRoutes) //this allows us to add prefix to the url. DRY coding.
app.use("/campgrounds/:id/comments", commentRoutes) //


app.listen(port, () => console.log(`App listening at http://localhost:${port}`))