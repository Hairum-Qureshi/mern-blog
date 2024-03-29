import mongoose from "mongoose";

export interface User_Interface {
	_id: mongoose.Types.ObjectId;
	email: string;
	first_name: string;
	last_name: string;
	full_name?: string;
	password?: string;
	profile_picture: string;
	date_joined?: string;
	num_blogs: number;
	verified: boolean;
}

export interface Token_Interface {
	_id: mongoose.Types.ObjectId;
	token: string;
	user_id: string;
	new_password?: string;
}
