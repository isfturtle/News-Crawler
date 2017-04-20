var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var StorySchema = new Schema({
	headline: {
		type: String
	},
	link: {
		type: String,
		unique: true
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}],
	date: {
		type: Date
	},
	image: {
		type: String
	},
	blurb: {
		type: String
	}
});

var Story = mongoose.model("Story", StorySchema);

module.exports = Story;