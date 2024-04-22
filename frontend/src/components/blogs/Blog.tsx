import { useParams } from "react-router-dom";
import useBlogOperations from "../../hooks/useBlogOperations";
import { useEffect } from "react";
import blog_css from "../../css/blog.module.css";
import NotFound from "../NotFound";

export default function Blog() {
	const { blog_id } = useParams();
	const { getBlogData, blogData, getBlogAuthor } = useBlogOperations();

	useEffect(() => {
		blog_id && getBlogData(blog_id);
	}, [blog_id]);

	if (blogData) {
		getBlogAuthor(blogData.user_id);
	}

	return blogData && blogData.message !== "blog not found" ? (
		<div className={blog_css.blogContainer}>
			<div className={blog_css.detailsContainer}>
				<h1>{blogData.blog_title}</h1>
				<div className={blog_css.userInfo}>
					<img
						src="https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"
						alt="user profile picture"
					/>
					<h4>{blogData.blog_author}</h4>
				</div>
			</div>
			<div className={blog_css.contentContainer}>
				<div dangerouslySetInnerHTML={{ __html: blogData.blog_content }}></div>
			</div>
		</div>
	) : (
		<NotFound />
	);
}
