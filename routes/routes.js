var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var Comment = require("../models/Comment.js");
var Story = require("../models/Story.js");

module.exports = function(app){

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
			Story.find().sort({date: -1}).exec(function(err, data){
				if(err){console.log(err);}
				else{
					//console.log(results);
					res.render("stories", {stories: data});
				}
			});

		});
	});
	app.get("/test", function(req, res){
		Story.find().sort({date: -1}).exec(function(err, results){
				if(err){console.log(err);}
				else{
					//console.log(results);
					res.send(results);
				}
			});

	});
	

	app.get("/comments/:id", function(req, res){
		Story.find({_id: req.params.id}).populate("comments").exec(function(err, results){
			if(err){console.log(err);}
			else{
				//res.send(results[0]);
				res.render("comments", {story: results[0]});
			}
		})
	});

	app.post("/comments/add/:id", function(req, res){
		var comment = new Comment({
			author: req.body.author,
			body: req.body.body,
			story: req.params.id
		});
		comment.save(function(err, doc){
			console.log("comment saved");
			console.log(doc);
			console.log(req.params.id);
			if(err){console.log(err);}
			else{
				console.log("Now we update?")
				Story.update({
				_id: req.params.id
				}, {
					$push:{
						comments: doc._id
						}
					},
					function(er, data){
						if(er){console.log(er);}
						else{
							console.log("pushed");
							//res.send(data);
							res.render("comments", {story: data});
						}
					});
			}
		});

	});


}