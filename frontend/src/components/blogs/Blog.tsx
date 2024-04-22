import { Link, useParams } from "react-router-dom";
import useBlogOperations from "../../hooks/useBlogOperations";
import { useEffect } from "react";
import blog_css from "../../css/blog.module.css";
import NotFound from "../NotFound";
import useAuthContext from "../../contexts/authContext";

export default function Blog() {
	const { blog_id } = useParams();
	const { userData, signOut } = useAuthContext()!;
	const { getBlogData, blogData } = useBlogOperations();

	useEffect(() => {
		blog_id && getBlogData(blog_id);
	}, [blog_id]);

	return blogData && blogData.message !== "blog not found" ? (
		<div className={blog_css.blogContainer}>
			<div className={blog_css.detailsContainer}>
				<h1>{blogData.blog_title}</h1>
				<div className={blog_css.userInfo}>
					<h3>
						Written by:
						<span>
							&nbsp;
							<Link to={`/user/${blogData.user_id}/profile`}>
								{blogData.blog_author}
							</Link>
						</span>
					</h3>
				</div>
				<div className={blog_css.buttonContainer}>
					{userData && userData.user_id === blogData.user_id ? (
						<>
							<button>Delete Blog</button> <button>Edit Blog</button>
						</>
					) : null}
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
