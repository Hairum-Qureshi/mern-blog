export interface User_Interface {
	_id: string;
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
