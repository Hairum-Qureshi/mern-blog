import landing_css from "../css/landing.module.css";
import useAuthContext from "../contexts/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarDays,
	faComment,
	faTags,
	faUser
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import useBlogData from "../hooks/useBlogData";
import { Blog } from "../interfaces";

export default function Landing() {
	const { userData } = useAuthContext()!;
	const { blogs } = useBlogData();

	const navigate = useNavigate();
	// ! When retrieving all the blogs, you'll need to do some pagination and you'll need to handle the case where there are no blogs. If there are no blogs posted, you'll get back '{ message: "no blogs" }'

	// TODO - consider adding a property to handle the number of comments on a post
	// TODO - add a like attribute to the blogs as well
	// TODO - add a like counter to each blog collection
	// TODO - add a comment counter to each blog collection
	// TODO - add a tag feature to the blog post form + collection
	// ! FIX - the image's width for the blog thumbnails aren't the same for all images

	return userData && userData.message !== "user does not exist" ? (
		<div className={landing_css.main}>
			{blogs && blogs.length > 0
				? blogs.map((blog: Blog) => {
						return blog.published ? (
							<div className={landing_css.blogsContainer}>
								<div className={landing_css.blogBlock}>
									<h3 className={landing_css.title}>{blog.blog_title}</h3>
									<hr />
									<div className={landing_css.blogData}>
										<p>
											<span>
												<FontAwesomeIcon icon={faUser} />
											</span>
											<Link to={`/user/${blog.user_id}/profile`}>
												{blog.blog_author}
											</Link>
											<span>
												<FontAwesomeIcon icon={faCalendarDays} />
											</span>
											<Link to="#">
												{new Date(blog.posted_date).toLocaleDateString(
													"en-US",
													{
														year: "numeric",
														month: "long",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													}
												)}
											</Link>
											<span>
												<FontAwesomeIcon icon={faComment} />
											</span>
											<Link to="#">23 Comments</Link>
											<span>
												<FontAwesomeIcon icon={faTags} /> Tags:
											</span>
											<div className={landing_css.tag}>home</div>
											<div className={landing_css.tag}>cooking</div>
										</p>
									</div>
									<hr />
									<div className={landing_css.blogPreviewContentContainer}>
										<div className={landing_css.blogThumbnailContainer}>
											<img src={blog.blog_thumbnail} alt="Blog Thumbnail" />
										</div>
										<div className={landing_css.blogSummaryContainer}>
											<p>{blog.blog_summary}</p>
											<button
												onClick={() =>
													navigate(
														`/blogs/${blog.route_id}/${blog.sanitized_title}`
													)
												}
											>
												Read More
											</button>
										</div>
									</div>
								</div>
							</div>
						) : null;
				  })
				: null}
		</div>
	) : (
		<div className={landing_css.main}>User is not logged in</div>
	);
}
