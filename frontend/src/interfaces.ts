export interface Google_User_Interface {
	email: string;
	family_name: string; // last name
	given_name: string; // first name
	name: string; // first + last name
	profile_picture: string;
}

export interface ErrorHandler {
	noFirstName?: boolean;
	noLastName?: boolean;
	noEmail?: boolean;
	noPassword?: boolean;
	noDuplicatePassword?: boolean;
	message: string;
}

export interface AuthTypes {
	loginWithGoogle: () => void;
	login: (email: string, password: string) => void;
	createAccount: (
		firstName: string,
		lastName: string,
		email: string,
		password: string
	) => void;
	resetPassword: (
		email: string,
		password: string,
		duplicatePassword: string
	) => void;
	errorHandler: ErrorHandler;
}

export interface ContextData {
	userData: User | null;
	error: string | null;
	signOut: () => void;
}

export interface AuthProps {
	children: React.ReactNode;
}

export interface User {
	user_id: string;
	email: string;
	first_name: string;
	last_name: string;
	full_name: string;
	profile_picture: string;
	date_joined: string;
	num_blogs: number;
}
