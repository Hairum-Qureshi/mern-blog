import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { ContextData, AuthProps, User } from "../../src/interfaces";

export const AuthContext = createContext<ContextData | null>(null);

export const AuthProvider = ({ children }: AuthProps) => {
	const [userData, setUserData] = useState<User | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getCurrUserData = async () => {
			try {
				const userDataResponse = await axios.get(
					"http://localhost:4000/api/user/current/logged-in",
					{
						withCredentials: true
					}
				);
				if (userDataResponse.data.message === "user is not logged in") {
					setUserData(null);
				} else {
					setUserData(userDataResponse.data);
				}
			} catch (error) {
				console.error("There was an error", error);
			}
		};

		getCurrUserData();
	}, []);

	const signOut = async () => {
		try {
			const response = await axios.get(
				"http://localhost:4000/api/user/logout",
				{
					withCredentials: true
				}
			);
			console.log(response.data);
			// if (response.status === 200) {
			//     setUserData(null);
			// }
		} catch (error) {
			console.error("There was an error", error);
		}
	};

	const value: ContextData = {
		userData,
		error,
		signOut
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
	return useContext(AuthContext);
};

export default useAuthContext;
