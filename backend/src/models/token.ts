import { InferSchemaType, Schema, model } from "mongoose";

const tokenSchema = new Schema({
	token: {
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true
	},
	new_password: {
		type: String,
		required: false
	}
});

type Token = InferSchemaType<typeof tokenSchema>;

export default model<Token>("Token", tokenSchema);
