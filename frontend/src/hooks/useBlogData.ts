import axios from "axios";
import { Blog, BlogTools } from "../interfaces";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useBlogData(): BlogTools {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [totalPages, setTotalPages] = useState(0);

	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		async function getBlogData() {
			await axios
				.get(
					`http://localhost:4000/api/blogs/all?page=${searchParams.get("page")}`
				)
				.then(response => {
					setBlogs(response.data.all_blogs);
					setTotalPages(response.data.totalPages);
				})
				.catch(error => console.log(error));
		}

		getBlogData();
	}, [searchParams]);

	return { blogs, totalPages };
}
