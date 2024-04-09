import mongoose from "mongoose";

interface SocialMedia {
	twitter_x: string;
	instagram: string;
	facebook: string;
	pinterest: string;
	discord: string;
}

export interface User_Interface {
	_id: mongoose.Types.ObjectId;
	email: string;
	first_name: string;
	last_name: string;
	full_name?: string;
	password?: string;
	profile_picture: string;
	biography: string;
	followers: number;
	following: number;
	date_joined?: string;
	num_blogs: number;
	verified: boolean;
	show_email: boolean;
	title: string;
	social_media: SocialMedia;
	backdrop: string;
}

export interface Token_Interface {
	_id: mongoose.Types.ObjectId;
	token: string;
	user_id: string;
	new_password?: string;
}
