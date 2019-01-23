//NPM NODES NEEDED
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

//OUR PORT
var PORT = process.env.PORT || 3000;

//REQUIRING MODELS
var db = require("./models");

//SETTING UP THE VARIABLE TO CALL EXPRESS
var app = express();

//SETTING UP THE MORGAN LOGGER SO WE CAN START SCRAPING
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//CONNECTING TO OUR DATABASE WITH MONGOOSE
//old code used locally
// mongoose.connect("mongodb://localhost/mongodbHW", { useNewUrlParser: true });

app.use((req, res, next) => {
    if (mongoose.connection.readyState) {
        console.log("if (mongoose.connection.readyState)");
        next();
    } else {
        console.log("else (mongoose.connection.readyState)");
        require("./mongo")().then(() => next());
        console.log("else (mongoose.connection.readyState")
    }
});

//ESTABLISHING OUR ROUTES

//OUR SCRAPER ROUTE TO PULL FROM PC GAMER NEWS\
app.get("/scrape", function(req, res) {
    axios.get("https://www.pcgamer.com/news/").then(function(response) {
        var $ = cheerio.load(response.data);

        //specifying the location of the content we wish to pull
        $("#content > section > div > div.listingResult.small").each(function(i, element) {
            console.log("\nFound listing result #" + i);
            var result = {};

            result.headline = $(this).find(".article-name").text();
            result.link = $(this).children("a").attr("href");

            console.log("Headline: " + result.headline);
            console.log("Link: " + result.link);

            //store each headline's text and link in the database
            db.Article.create(result)
              .then(function(dbArticle) {
                console.log(dbArticle);
              })
              .catch(function(err) {
                console.log(err);
              });
        });

        //message for client when finished
        res.send("PC Gamer Scrape complete!");
    });
});

//SET UP ROUTE TO DISPLAY ALL ARTICLES SAVED IN DB/THE DEFAULT ROUTE, currently just for the json
app.get("/articles", function(req, res) {
    db.Article.find({})
     .then(function(articles) {
       res.json(articles);  
     })
     .catch(function(err) {
       res.json(err);
     });
});

//
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
     //using populate to pull in the value of EXCITEMENT
     .populate("excitement")
     .then(function(dbArticle) {
        res.json(dbArticle);
     })
     .catch(function(err) {
       res.json(err);  
     });
});

//SET UP ROUTE FOR SPECIFIC ARTICLE ID AND CHANGING THE BOOLEAN EXCITMENT VALUE
app.post("/articles/:id", function(req, res) {
    db.Excitement.create(req.body)
     .then(function(dbExcite) {
       return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: {excitement:dbExcite._id}, $set: {isExcited:req.body.isExcited} }, { new: true });
     })
     .then(function(dbArticle) {
        res.json(dbArticle);
     })
     .catch(function(err) {
        res.json(err);
     });
});

//SET UP ROUTE FOR JUST THE EXCITING STORIES
app.get("/exciting/", function(req, res) {
    db.Article.find({isExcited: true})
      .then(function(articles) {
          res.json(articles);
      })
      .catch(function(err) {
        res.json(err);
      });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
  