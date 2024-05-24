import axios from "axios";
import { Blog, BlogTools } from "../interfaces";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useBlogData(): BlogTools {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();
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
				.catch(error => setErrorMessage(error.response.data.message));
		}

		getBlogData();
	}, [searchParams]);

	return { blogs, totalPages, errorMessage };
}
