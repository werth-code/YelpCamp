const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      seedDB = require("./seeds"),
      Campground = require("./models/campground.js"),
      // Comment = require("./models/comment"),
      port = 3000
    
const mongoose = require("mongoose");
const { request } = require('express');
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Connected to DB!")).catch((error) => console.log(error.message));

seedDB()

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.get('/', (req, res) => {
    res.render("landing")
})

//INDEX - show all camps

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
      if(err) console.log(err)
      else res.render("index", { campgrounds: allCampgrounds });
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
    res.render('new')
})

//SHOW - id route to individual camp info - this url must be last 
// as it is really /anything and we want /campgrounds etc to be specific

app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec( (err, foundCamp) => {
    if (err) console.log("Error", err);
    else {
      console.log(foundCamp)
      res.render("show", { campground: foundCamp })
    }  
  })
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))