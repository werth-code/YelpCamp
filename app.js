const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      seedDB = require("./seeds"),
      Campground = require("./models/campground.js"),
      Comment = require("./models/comment"),
      port = 3000
    
const mongoose = require("mongoose");
const { request } = require('express');
const campground = require('./models/campground.js');
const e = require('express');
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Connected to DB!")).catch((error) => console.log(error.message));

seedDB()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")
app.get('/', (req, res) => {
    res.render("landing")
})

//INDEX - show all camps

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
      if(err) console.log(err)
      else res.render("campgrounds/index", { campgrounds: allCampgrounds });
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

app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) console.log("Error", err)
    else res.render("comments/new", {campground: campground})
  })
})

app.post("/campgrounds/:id/comments", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) res.redirect("/campgrounds")
    else Comment.create(req.body.comment, (err, comment) => {
        if(err) console.log(err)
        else {
          campground.comments.push(comment)
          campground.save()
          res.redirect("/campgrounds/" + campground._id)
        }
    })  
  })
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))