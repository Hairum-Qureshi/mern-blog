export interface Google_User_Interface {
	email: string;
	family_name: string; // last name
	given_name: string; // first name
	name: string; // first + last name
	profile_picture: string;
}

export interface AuthTypes {
	loginWithGoogle: () => void;
	userData: Google_User_Interface | undefined;
}
