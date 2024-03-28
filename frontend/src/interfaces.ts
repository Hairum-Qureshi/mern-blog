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
	sendEmail: (email: string) => void;
	errorHandler: ErrorHandler;
}