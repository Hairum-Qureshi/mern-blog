import axios from "axios";
import { Blog_Interface, ProfileTools, User } from "../interfaces";
import { useState } from "react";

export default function useProfileData(): ProfileTools {
	const [userProfileData, setUserProfileData] = useState<User | null>(null);
	const [blogs, setBlogs] = useState<Blog_Interface | null>(null);

	async function getProfileData(user_id: string) {
		await axios
			.get(`http://localhost:4000/api/user/${user_id}`)
			.then(response => {
				setUserProfileData(response.data);
				getAllBlogs(user_id);
			})
			.catch(error => console.log(error));
	}

	async function getAllBlogs(user_id: string) {
		await axios
			.get(`http://localhost:4000/api/blogs/${user_id}/all`)
			.then(response => setBlogs(response.data))
			.catch(error => console.log(error));
	}

	return { getProfileData, userProfileData, blogs };
}
