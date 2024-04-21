import { BlogOperations } from "../interfaces";
import axios from "axios";

export default function useBlogOperations(): BlogOperations {
	async function postBlog(
		blogTitle: string,
		blogSummary: string,
		thumbnail: File,
		blogContent: string
	) {
		const formData = new FormData();
		formData.append("file", thumbnail);
		formData.append("image_type", "blog_thumbnail");
		formData.append("blogTitle", blogTitle);
		formData.append("blogSummary", blogSummary);
		formData.append("blogContent", blogContent);

		try {
			const response = await axios.post(
				"http://localhost:4000/api/blogs/post",
				formData,
				{
					withCredentials: true
				}
			);

			if (response.status === 200) {
				console.log("Success!");
			}
		} catch (error) {
			console.log(error);
		}
	}

	return { postBlog };
}
