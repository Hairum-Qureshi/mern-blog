import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AuthTypes, ErrorHandler } from "../interfaces";
import { useState } from "react";

// TODO - fix the error handling for creating an account. Need to put more emphasis on making sure the email is the correct format. Currently, if you just put 1 letter or no @ sign, the form still deems this as a valid email which is incorrect

// TODO - need to add criteria of making passwords
/*
	-Passwords must be at least 10 characters long
	-Maybe add a "password is too weak" checker?
*/

export default function useAuth(): AuthTypes {
	const [errorHandler, setErrorHandler] = useState<ErrorHandler>({
		noFirstName: false,
		noLastName: false,
		noEmail: false,
		noPassword: false,
		noDuplicatePassword: false,
		message: ""
	});
	const [loading, setLoading] = useState(false);

	// TODO - Need to improve email validation + need to send user a verification email!

	const emailRegex: RegExp = new RegExp(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
	);

	const loginWithGoogle = useGoogleLogin({
		onSuccess: credentialResponse => {
			axios
				.get("https://www.googleapis.com/oauth2/v3/userinfo", {
					headers: {
						Authorization: `Bearer ${credentialResponse.access_token}`
					}
				})
				.then(response => {
					const { email, family_name, given_name, name, picture } =
						response.data;
					axios
						.post(
							"http://localhost:4000/api/user/google-login",
							{
								email,
								first_name: given_name,
								last_name: family_name,
								full_name: name,
								profile_picture: picture
							},
							{
								withCredentials: true
							}
						)
						.then(response => {
							if (response.status === 200 || response.status === 201) {
								setErrorHandler({
									noEmail: false,
									noPassword: false,
									message: ""
								});

								window.location.href = `http://localhost:5173/user/${response.data}/profile`;
							}
						})
						.catch(error => {
							if (
								error.response.data === "A user already exists with this email"
							) {
								setErrorHandler({
									noEmail: true,
									noPassword: false,
									message: error.response.data || "Error logging in with Google"
								});
							} else {
								setErrorHandler({
									noEmail: false,
									noPassword: false,
									message: error.response.data || "Error logging in with Google"
								});
							}
						});
				})
				.catch(error => {
					console.error("Error:", error);
				});
		},
		onError: () => {
			setErrorHandler({
				message: "There was an error signing in with Google"
			});
		}
	});

	function login(email: string, password: string) {
		if (!email.trim() && !password) {
			setErrorHandler({
				noEmail: true,
				noPassword: true,
				message: "Please fill out all required fields"
			});
		} else if (!email.trim().toLowerCase().match(emailRegex) && !password) {
			setErrorHandler({
				noEmail: false,
				noPassword: false,
				message: "Incorrect email format and missing password"
			});
		} else if (!email.trim().toLowerCase().match(emailRegex)) {
			setErrorHandler({
				noEmail: true,
				noPassword: false,
				message: "Incorrect email format"
			});
		} else {
			setErrorHandler({
				noEmail: !email,
				noPassword: !password,
				message: !email.trim()
					? "Please provide your email"
					: !password
					? "Please provide your password"
					: ""
			});
		}

		if (email.trim() && password) {
			axios
				.post(
					"http://localhost:4000/api/user/login",
					{
						email: email.toLowerCase().trim(),
						password
					},
					{
						withCredentials: true
					}
				)
				.then(response => {
					if (response.status === 200) {
						setErrorHandler({
							noEmail: false,
							noPassword: false,
							message: ""
						});

						window.location.href = `http://localhost:5173/user/${response.data}/profile`;
					}
				})
				.catch(error => {
					setErrorHandler({
						noEmail: false,
						noPassword: false,
						message: error.response.data
					});
				});
		}
	}

	function createAccount(
		firstName: string,
		lastName: string,
		email: string,
		password: string
	) {
		if (!firstName.trim() && !lastName.trim() && !email.trim() && !password) {
			setErrorHandler({
				noFirstName: true,
				noLastName: true,
				noEmail: true,
				noPassword: true,
				message: "Please fill out all required fields"
			});
		} else if (!email.trim().toLowerCase().match(emailRegex)) {
			setErrorHandler({
				noFirstName: false,
				noLastName: false,
				noEmail: true,
				noPassword: false,
				message: "Incorrect email format"
			});
		} else {
			setErrorHandler({
				noFirstName: !firstName.trim(),
				noLastName: !lastName.trim(),
				noEmail: !email.trim(),
				noPassword: !password,
				message: "Please be sure to fill out all required fields"
			});
		}

		if (firstName.trim() && lastName.trim() && email.trim() && password) {
			setLoading(true);
			axios
				.post(
					"http://localhost:4000/api/user/create-user",
					{
						first_name: firstName.trim(),
						last_name: lastName.trim(),
						email: email.toLowerCase().trim(),
						password
					},
					{
						withCredentials: true
					}
				)
				.then(response => {
					console.log(response.data);
					setErrorHandler({
						noFirstName: false,
						noLastName: false,
						noEmail: false,
						noPassword: false,
						message: response.data || ""
					});
					setLoading(false);
				})
				.catch(error => {
					setErrorHandler({
						noEmail: false,
						noPassword: false,
						message: `${error.response.data}`
					});
					setLoading(false);
				});

			setErrorHandler({
				noFirstName: false,
				noLastName: false,
				noEmail: false,
				noPassword: false,
				message: ""
			});
		}
	}

	function resetPassword(
		email: string,
		password: string,
		duplicatePassword: string
	) {
		if (!email && !password && !duplicatePassword) {
			setErrorHandler({
				noEmail: true,
				noPassword: true,
				noDuplicatePassword: true,
				message: "Please fill in all the required fields"
			});
		} else if (email && password && duplicatePassword) {
			axios
				.post("http://localhost:4000/api/user/forgot-password", {
					email: email.toLowerCase().trim(),
					duplicatePassword
				})
				.then(response => {
					setErrorHandler({
						noEmail: false,
						noPassword: false,
						noDuplicatePassword: false,
						message: response.data || ""
					});
				})
				.catch(error => {
					console.log(error);
					setErrorHandler({
						noEmail: false,
						noPassword: false,
						noDuplicatePassword: false,
						message: error.response.data
					});
				});
		} else if (email && duplicatePassword !== password) {
			setErrorHandler({
				noEmail: false,
				noPassword: true,
				noDuplicatePassword: true,
				message: "Passwords do not match"
			});
		} else {
			setErrorHandler({
				noEmail: !email,
				noPassword: !password,
				noDuplicatePassword: !duplicatePassword,
				message: "Please fill in all the required fields"
			});
		}
	}

	return {
		loginWithGoogle,
		login,
		createAccount,
		resetPassword,
		errorHandler,
		loading
	};
}
