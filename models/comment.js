var mongoose = require("mongoose");
var Campground = require("./campground")

const commentSchema = mongoose.Schema({
    text: String,
    author: String
})

module.exports = mongoose.model('Comment', commentSchema)