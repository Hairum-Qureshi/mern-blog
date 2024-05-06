import axios from "axios";
import { Blog, BlogTools } from "../interfaces";
import { useEffect, useState } from "react";

export default function useBlogData(): BlogTools {
	const [blogs, setBlogs] = useState<Blog[]>([]);

	useEffect(() => {
		async function getBlogData() {
			await axios
				.get("http://localhost:4000/api/blogs/all")
				.then(response => setBlogs(response.data))
				.catch(error => console.log(error));
		}

		getBlogData();
	}, []);

	return { blogs };
}
