var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect("mongodb://localhost/News-Crawler");
// Hook mongoose connection to db
var db = mongoose.connection;

// Log any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Log a success message when we connect to our mongoDB collection with no issues
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

var Comment = require("./models/Comment.js");
var Story = require("./models/Story.js");

//Routes. I should probably put these in a different file but I don't feel like it.

app.get("/", function(req, res){
	var results = [];
	request("http://www.livescience.com/news", function(error, response, html){
		var $ = cheerio.load(html);

		$("li.search-item.line.pure-g").each(function(i, element){
			var link = 	$(element).find("a.read-url").attr("href");
			link = "http://livescience.com" + link;
			//console.log(link);
			var dateString = $(element).find("div.date-posted").text();
			dateString = dateString.substring(0, dateString.indexOf('|'));
			//console.log(dateString);
			var date = Date(dateString);
			//console.log(date);
			var headline = $(element).find("h2").find("a").text();
			//console.log(headline);
			var blurb = $(element).find("p.mod-copy").text();
			blurb = blurb.substring(0, blurb.indexOf("Read More")).trim();
			//console.log(blurb);
			var image = $(element).find("img").attr("src");
			//console.log (image);
			results.push({
				link: link,
				date: date,
				headline: headline,
				blurb: blurb,
				image: image
			});
			//console.log(results);
		});
		for(var i=0; i<results.length; i++){
			var story = new Story(results[i]);
			story.save(function(error, doc){
				if(error){
					console.log(error);
				}
				else{
					console.log(doc);
				}
			})
		}
	});
})











app.listen(PORT, function(){
	console.log("App is running on port "+PORT);
});