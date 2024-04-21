import { useParams } from "react-router-dom";
import useBlogOperations from "../../hooks/useBlogOperations";
import { useEffect } from "react";

export default function Blog() {
	const { blog_id } = useParams();
	const { getBlogData } = useBlogOperations();

	useEffect(() => {
		blog_id && getBlogData(blog_id);
	}, [blog_id]);

	return <div>{blog_id}</div>;
}
