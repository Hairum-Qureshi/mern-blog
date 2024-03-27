import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	full_name: {
		type: String
	},
	profile_picture: {
		type: String,
		default:
			"https://i.pinimg.com/originals/bc/8f/29/bc8f29c4183345bcc63bd4a161e88c71.png"
	},
	date_joined: {
		type: String
	},
	num_blogs: {
		type: Number
	}
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
