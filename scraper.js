var request = require("request");
var cheerio = require("cheerio");
//I can't figure out how to export this, so I'm just going to copy & paste to server.js



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
	});
