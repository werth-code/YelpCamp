const express = require('express')
const app = express()
const port = 3000

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render("landing")
})

app.get('/campgrounds', (req, res) => {
    let campgrounds = [
        { name: "Salmon Creek", image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg"},
        { name: "Bear Creek", image: "https://fpdcc.com/wp-content/uploads/2018/05/camping-feature.jpg" },
        { name: "Puma Creek", image: "https://www.clickondetroit.com/resizer/TKok3oQdJk7boUfr9XljSKMmz7c=/886x498/smart/filters:format(jpeg):strip_exif(true):strip_icc(true):no_upscale(true):quality(65)/cloudfront-us-east-1.images.arcpublishing.com/gmg/BQLUDDAS4BGJJJ3MEEA3MODYGU.jpg" }
    ]

    res.render('campgrounds', {campgrounds: campgrounds})
})



app.listen(port, () => console.log(`App listening at http://localhost:${port}`))