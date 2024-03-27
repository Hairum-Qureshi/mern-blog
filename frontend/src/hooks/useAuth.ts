import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { Google_User_Interface, AuthTypes } from "../interfaces";

export default function useAuth(): AuthTypes {
	const [userData, setUserData] = useState<Google_User_Interface | undefined>(
		undefined
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
					setUserData({
						email,
						family_name,
						given_name,
						name,
						profile_picture: picture
					});
				})
				.catch(error => {
					console.error("Error:", error);
				});
		},
		onError: () => {
			console.log("Login Failed");
		}
	});

	return { loginWithGoogle, userData };
}
