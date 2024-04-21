import { useState } from "react";
import { BlogOperations } from "../interfaces";
import axios from "axios";

export default function useBlogOperations(): BlogOperations {
	const [loading, setLoading] = useState(false);

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
			setLoading(true);

			const response = await axios.post(
				"http://localhost:4000/api/blogs/post",
				formData,
				{
					withCredentials: true
				}
			);

			if (response.data.status === 200) {
				setLoading(false);
				window.location.href = response.data.link;
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	}

	async function getBlogData(route_id: string) {
		console.log(route_id);
	}

	return { postBlog, loading, getBlogData };
}
