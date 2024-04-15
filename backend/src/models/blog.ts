import { InferSchemaType, Schema, model } from "mongoose";

const blogSchema = new Schema({
	title: {
		type: String,
		required: true,
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
	blog_content: {
		type: String,
		required: true
	},
	blog_author: {
		type: String,
		ref: "User"
	},
	posted_date: {
		type: Date,
		default: Date.now
	}
});

type Blog = InferSchemaType<typeof blogSchema>;

export default model<Blog>("Blog", blogSchema);
