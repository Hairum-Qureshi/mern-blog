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
	password: {
		type: String
	},
	profile_picture: {
		type: String,
		default:
			"https://i.pinimg.com/originals/bc/8f/29/bc8f29c4183345bcc63bd4a161e88c71.png"
	},
	biography: {
		type: String,
		default: "This user currently doesn't have a bio"
	},
	followers: {
		type: Number,
		default: 0
	},
	following: {
		type: Number,
		default: 0
	},
	date_joined: {
		type: String
	},
	num_blogs: {
		type: Number
	},
	verified: {
		type: Boolean,
		default: false
	},
	show_email: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: "Newbie"
	},
	social_media: {
		type: Map,
		default: {
			twitter_x: "",
			instagram: "",
			facebook: "",
			pinterest: "",
			discord: ""
		}
	},
	backdrop: {
		type: String,
		default:
			"https://wallpapers.com/images/hd/blue-mountain-03x28faoww0g6fpm.jpg"
	},
	isGoogleAccount: {
		type: Boolean
	},
	cloudinaryPfp_ID: {
		type: String,
		default: ""
	},
	cloudinaryBackdrop_ID: {
		type: String,
		default: ""
	},
	blocked_users: {
		type: [String],
		default: []
	},
	archived_blogs: {
		type: [String],
		default: []
	},
	postNotifEnabledAccounts: {
		// holds the user IDs of the accounts the user has post notifications enabled
		type: [String],
		default: []
	},
	postNotifSubscriber_emails: {
		// holds the emails of other users that enabled notifications for the user
		type: [String],
		default: []
	}
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
