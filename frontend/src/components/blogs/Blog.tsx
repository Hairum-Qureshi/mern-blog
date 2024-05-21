import { Link, useNavigate, useParams } from "react-router-dom";
import useBlogOperations from "../../hooks/useBlogOperations";
import { useEffect, useState } from "react";
import blog_css from "../../css/blog.module.css";
import NotFound from "../NotFound";
import useAuthContext from "../../contexts/authContext";
import useProfileData from "../../hooks/useProfileData";

export default function Blog() {
	const { blog_id, blog_name } = useParams();
	const { userData } = useAuthContext()!;
	const { getBlogData, blogData } = useBlogOperations();
	const navigate = useNavigate();
	const { handlePublishStatus } = useProfileData();

	useEffect(() => {
		blog_id && blog_name && getBlogData(blog_id, blog_name);
	}, [blog_id, blog_name]);

	const { deleteBlog } = useProfileData();

	function removeBlog(blog_id: string, blog_title: string) {
		const confirmation = confirm(
			`Are you sure you would like to delete the blog "${blog_title}"? You will not be able to restore it once deleted`
		);
		if (confirmation) {
			deleteBlog(blog_id);
			navigate(`/user/${userData?.user_id}/profile`);
		}
	}

	const [showMessage, setShowMessage] = useState(true);

	if (
		!blogData ||
		blogData.message === "blog not found" ||
		(blogData.archived && blogData.user_id !== userData?.user_id) ||
		(!blogData.published && blogData.user_id !== userData?.user_id)
	) {
		return <NotFound />;
	}

	return (
		<div className={blog_css.blogContainer}>
			{showMessage ? (
				blogData?.archived && blogData.user_id === userData?.user_id ? (
					<div className={blog_css.archiveNotice}>
						THIS BLOG IS ARCHIVED. CLICK HERE TO UNARCHIVE IT VIA SETTINGS
					</div>
				) : !blogData.published && blogData.user_id === userData?.user_id ? (
					<div className={blog_css.archiveNotice}>
						THIS BLOG IS UNPUBLISHED. CLICK&nbsp;
						<Link
							to="#"
							onClick={() => {
								handlePublishStatus(blogData._id, true);
								setShowMessage(false);
							}}
						>
							HERE
						</Link>
						&nbsp;TO PUBLISH IT
					</div>
				) : null
			) : null}
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
					{userData && userData.user_id === blogData.user_id && (
						<>
							<button
								onClick={() => removeBlog(blogData._id, blogData.blog_title)}
							>
								Delete Blog
							</button>
							<button onClick={() => navigate(`/blog/${blog_id}/edit`)}>
								Edit Blog
							</button>
						</>
					)}
				</div>
			</div>
			<div className={blog_css.contentContainer}>
				<div dangerouslySetInnerHTML={{ __html: blogData.blog_content }}></div>
			</div>
		</div>
	);
}
