import landing_css from "../css/landing.module.css";
import useAuthContext from "../contexts/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarDays,
	faComment,
	faTags,
	faUser
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useBlogData from "../hooks/useBlogData";
import { Blog } from "../interfaces";

export default function Landing() {
	const { userData } = useAuthContext()!;
	const { blogs, totalPages, errorMessage } = useBlogData();
	const [searchParams] = useSearchParams();

	const pageNumbers: string[] = [];
	for (let i = 0; i < totalPages - 1; i++) {
		pageNumbers.push((i + 1).toString());
	}

	const navigate = useNavigate();

	// ! When retrieving all the blogs, you'll need to do some pagination and you'll need to handle the case where there are no blogs. If there are no blogs posted, you'll get back '{ message: "no blogs" }'

	// TODO - consider adding a property to handle the number of comments on a post
	// TODO - add a like attribute to the blogs as well
	// TODO - add a like counter to each blog collection
	// TODO - add a comment counter to each blog collection
	// TODO - add a tag feature to the blog post form + collection
	// TODO - need to implement pagination
	// TODO - make it so that the newest blogs come first
	// TODO - fix the CSS so if all blogs are unpublished (it displays a message) or if there's only 1 blog posted, the input and H1 tag stays at the top of hte page and doesn't move to the middle/bottom
	// ! FIX - the image's width for the blog thumbnails aren't the same for all images

	return userData && userData.message !== "user does not exist" ? (
		<div className={landing_css.main}>
			{errorMessage === undefined ? (
				<>
					<h1>POSTED BLOGS</h1>
					<input
						type="text"
						placeholder="Search blog by title, author, or tag"
					/>
					{blogs && blogs.length > 0 ? (
						blogs.map((blog: Blog) => {
							return blog.published ? (
								<div className={landing_css.blogsContainer} key={blog.id}>
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
												<Link to="#">{blog.comment_count} Comments</Link>
												<span>
													<FontAwesomeIcon icon={faTags} /> Tags:
												</span>
												{blog.tags.map((tag: string, index: number) => {
													return (
														<div className={landing_css.tag} key={index}>
															{tag.toUpperCase()}
														</div>
													);
												})}
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
					) : (
						<h1>
							THERE CURRENTLY AREN'T ANY BLOGS POSTED. CLICK&nbsp;
							<Link to={`/user/${userData?.user_id}/blog/create`}>HERE</Link>
							&nbsp;TO POST THE FIRST BLOG!
						</h1>
					)}
				</>
			) : (
				<h1>PAGE OUT OF RANGE</h1>
			)}

			{totalPages > 1 ? (
				<div className={landing_css.paginationButtonsContainer}>
					<button
						disabled={
							searchParams.get("page") === null ||
							searchParams.get("page") === "0"
						}
						onClick={() => {
							const currentPage = Number(searchParams.get("page"));
							navigate(currentPage <= 1 ? "/" : `?page=${currentPage - 1}`);
						}}
					>
						Prev
					</button>
					{pageNumbers.map((pageNumber: string) => {
						return (
							<button
								onClick={() => navigate(`/?page=${pageNumber}`)}
								key={pageNumber}
							>
								{pageNumber}
							</button>
						);
					})}
					<button
						disabled={Number(searchParams.get("page")) === totalPages - 1}
						onClick={() => {
							navigate(`?page=${Number(searchParams.get("page")) + 1}`);
						}}
					>
						Next
					</button>
				</div>
			) : null}
		</div>
	) : (
		<div className={landing_css.main}>User is not logged in</div>
	);
}
