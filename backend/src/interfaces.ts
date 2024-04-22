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
	isGoogleAccount: boolean;
	cloudinaryPfp_ID: string;
	cloudinaryBackdrop_ID: string;
	blocked_users: string[];
	archived_blogs: string[];
}

export interface Token_Interface {
	_id: mongoose.Types.ObjectId;
	token: string;
	user_id: string;
	new_password?: string;
}

export interface Blog_Interface {
	_id: mongoose.Types.ObjectId;
	user_id: mongoose.Types.ObjectId;
	title: string;
	route_id: string;
	blog_summary: string;
	sanitized_title: string;
	blog_content: string;
	blog_author: string;
	blog_thumbnail: string;
	cloudinaryThumbnail_ID: string;
	posted_date: Date;
}
