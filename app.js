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
      
const { request } = require('express');
const campground = require('./models/campground.js');
const e = require('express');
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Connected to DB!")).catch((error) => console.log(error.message));

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

app.use( (req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")
app.get('/', (req, res) => {
    res.render("landing")
})

//INDEX - show all camps

app.get('/campgrounds', (req, res) => {
    console.log(req.user)
    Campground.find({}, (err, allCampgrounds) => {
      if(err) console.log(err)
      else res.render("campgrounds/index", { 
        campgrounds: allCampgrounds,
        currentUser: req.user
      });
    })
})

//CREATE - add new camp to db
app.post('/campgrounds', (req, res) => {
    let name = req.body.name //this is the name of our first form
    let image = req.body.image //this is the name of our second form
    let desc = req.body.description; // NOT ADDING DESC TO DATABASE!

    let newCampground = {name: name, image: image, description: desc}

    Campground.create(newCampground, (err, newlyCreated) => {
      if(err) console.log(err)
      else res.redirect("/campgrounds");
    })
})

//NEW - show form to create new camp 

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

//SHOW - id route to individual camp info - this url must be last 
// as it is really /anything and we want /campgrounds etc to be specific

app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec( (err, foundCamp) => {
    if (err) console.log("Error", err);
    else {
      console.log(foundCamp)
      res.render("campgrounds/show", { campground: foundCamp })
    }  
  })
})

//-------- Comments Routes

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) console.log("Error", err)
    else res.render("comments/new", {campground: campground})
  })
})

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

//Auth Routes

app.get("/register", (req, res) => {
  res.render("register")
})

app.post("/register", (req, res) => {
  const newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err)
      return res.render("register")
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds")
    })
  })
})

//Show Login Form

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req, res) => {
}) 

//Log Out

app.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/campgrounds")
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}


app.listen(port, () => console.log(`App listening at http://localhost:${port}`))