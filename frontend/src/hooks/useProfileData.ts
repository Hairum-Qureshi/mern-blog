import axios from "axios";
import { ProfileTools } from "../interfaces";

export default function useProfileData(): ProfileTools {
	async function getAllBlogs(user_id: string) {
		await axios
			.get(`http://localhost:4000/api/blogs/${user_id}/all`)
			.then(response => console.log(response.data))
			.catch(error => console.log(error));
	}

	return { getAllBlogs };
}
