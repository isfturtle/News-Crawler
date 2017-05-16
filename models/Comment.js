var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	author:{
		type: String
	},
	body: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	},
	story: {
		type: Schema.Types.ObjectId,
		ref: "Story"
	}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;