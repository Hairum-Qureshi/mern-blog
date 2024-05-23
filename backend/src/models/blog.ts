import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const blogSchema = new Schema({
	user_id: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	blog_title: {
		type: String,
		default: "Untitled Blog"
	},
	route_id: {
		type: String,
		unique: true,
		required: true
	},
	blog_summary: {
		type: String,
		required: true
	},
	// a URL-friendly title
	sanitized_title: {
		type: String,
		required: true
	},
	blog_content: {
		type: String,
		default: "There is currently no content provided for this blog."
	},
	blog_author: {
		type: String,
		ref: "User"
	},
	blog_thumbnail: {
		type: String
	},
	cloudinaryThumbnail_ID: {
		type: String,
		default: ""
	},
	published: {
		type: Boolean,
		default: true
	},
	archived: {
		type: Boolean,
		default: false
	},
	posted_date: {
		type: Date,
		default: Date.now
	},
	tags: {
		type: [String],
		default: []
	},
	comment_count: {
		type: Number,
		default: 0
	}
});

type Blog = InferSchemaType<typeof blogSchema>;

export default model<Blog>("Blog", blogSchema);
