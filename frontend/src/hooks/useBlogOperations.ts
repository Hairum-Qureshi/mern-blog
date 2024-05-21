import { useState } from "react";
import { BlogOperations, Blog } from "../interfaces";
import axios from "axios";

export default function useBlogOperations(): BlogOperations {
	const [loading, setLoading] = useState(false);
	const [blogData, setBlogData] = useState<Blog | null>(null);

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

	async function editBlog(
		blogTitle: string,
		blogSummary: string,
		thumbnail: File,
		blogContent: string,
		route_id: string
	) {
		try {
			const formData = new FormData();
			formData.append("file", thumbnail);
			formData.append("image_type", "thumbnail");
			formData.append("blogTitle", blogTitle);
			formData.append("blogSummary", blogSummary);
			formData.append("blogContent", blogContent);

			const response = await axios.put(
				`http://localhost:4000/api/blogs/${route_id}/edit`,
				formData,
				{
					withCredentials: true
				}
			);
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	}

	async function getBlogData(route_id: string) {
		await axios
			.get(`http://localhost:4000/api/blogs/blog/${route_id}`)
			.then(response => setBlogData(response.data))
			.catch(error => console.log(error));
	}

	return { postBlog, loading, getBlogData, blogData, editBlog };
}
