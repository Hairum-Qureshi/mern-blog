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
	noBiography?: boolean;
	message?: string;
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
	loading: boolean;
}

export interface ContextData {
	userData: User | null;
	error: string | null;
	signOut: () => void;
}

export interface AuthProps {
	children: React.ReactNode;
}

interface SocialMedia {
	twitter_x: string;
	instagram: string;
	facebook: string;
	pinterest: string;
	discord: string;
}

export interface User {
	user_id: string;
	email: string;
	first_name: string;
	last_name: string;
	full_name: string;
	profile_picture: string;
	biography: string;
	followers: number;
	following: number;
	date_joined: string;
	num_blogs: number;
	show_email: boolean;
	title: string;
	social_media: SocialMedia;
	backdrop: string;
	isGoogleAccount: boolean;
	message?: string;
	blocked_users: string[];
	archived_blogs: string[];
	postNotifEnabledAccounts: string[];
}

export interface useSettingsTypes {
	autoSave: (
		input_id: number,
		firstName?: string,
		lastName?: string,
		email?: string
	) => void;
	saving: boolean;
	showSavingStatus: () => void;
	data: User | null;
	message: string;
	deleteAccount: () => void;
	uploading: boolean;
	uploadImage: (imageFile: File, image_type: string) => void;
	autoSaveSocials: (
		input_id: number,
		twitterXUser?: string,
		instagrmUser?: string,
		facebookUser?: string,
		pinterestUser?: string,
		discordUser?: string
	) => void;
}

export interface Blog {
	_id: string;
	blog_title: string;
	user_id: string;
	route_id: string;
	blog_summary: string;
	sanitized_title: string;
	blog_content: string;
	blog_author: string;
	blog_thumbnail: string;
	cloudinaryThumbnail_ID: string;
	posted_date: Date;
	message?: string;
	published: boolean;
	archived: boolean;
	tags: string[];
	comment_count: number;
}

export interface BlogOperations {
	postBlog: (
		blogTitle: string,
		blogSummary: string,
		thumbnail: File,
		blogContent: string
	) => void;
	loading: boolean;
	getBlogData: (route_id: string, blog_name: string) => void;
	blogData: Blog | null;
	editBlog: (
		blogTitle: string,
		blogSummary: string,
		thumbnail: File,
		blogContent: string,
		route_id: string
	) => void;
}

export interface ProfileTools {
	getProfileData: (user_id: string) => void;
	userProfileData: User | null;
	blogs: Blog[] | null;
	handleArchiveStatus: (blog_id: string, archive_this: boolean) => void;
	handlePublishStatus: (blog_id: string, publish_this: boolean) => void;
	deleteBlog: (blog_id: string) => void;
	handleNotifications: (user_id: string, enableNotifications: boolean) => void;
}

export interface BlogTools {
	blogs: Blog[];
}
