import { useEffect, useState } from "react";
import useAuthContext from "../../contexts/authContext";
import useProfileData from "../../hooks/useProfileData";
import { useSettings } from "../../hooks/useSettings";
import { Link, useNavigate, useParams } from "react-router-dom";
import profile_css from "../../css/profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons/faEyeSlash";
import {
	faBoxArchive,
	faEye,
	faPenToSquare,
	faTrash
} from "@fortawesome/free-solid-svg-icons";
import { Blog } from "../../interfaces";

export default function Blogs() {
	const { userData } = useAuthContext()!;
	const { data } = useSettings();
	const { user_id } = useParams();
	const {
		getProfileData,
		userProfileData,
		blogs,
		handleArchiveStatus,
		handlePublishStatus,
		deleteBlog
	} = useProfileData();
	const [blogsToShow, setBlogsToShow] = useState<Blog[]>([]);

	useEffect(() => {
		if (user_id) {
			getProfileData(user_id);
		}
	}, [user_id]);

	useEffect(() => {
		if (blogs && blogs.length > 0) {
			const nonArchived_blogs: Blog[] = blogs.filter((blog: Blog) => {
				return !blog.archived;
			});
			setBlogsToShow(nonArchived_blogs);
		}
	}, [blogs]);

	const navigate = useNavigate();

	function archive(blog_id: string) {
		const nonArchivedBlogs_updated: Blog[] = blogsToShow.filter(
			(blog: Blog) => blog.route_id !== blog_id
		);
		setBlogsToShow(nonArchivedBlogs_updated);
	}

	function unPublish(blog_id: string) {
		const index: number = blogsToShow.findIndex(
			(blog: Blog) => blog.route_id === blog_id
		);

		const published_status: boolean = !blogsToShow[index].published;
		const updated: Blog[] = [...blogsToShow];
		updated[index] = {
			...blogsToShow[index],
			published: published_status
		};
		setBlogsToShow(updated);
	}

	function removeBlog(blog_id: string, blog_title: string) {
		const confirmation = confirm(
			`Are you sure you would like to delete the blog "${blog_title}"? You will not be able to restore it once deleted`
		);
		if (confirmation) {
			const nonArchivedBlogs_updated: Blog[] = blogsToShow.filter(
				(blog: Blog) => blog.route_id !== blog_id
			);
			setBlogsToShow(nonArchivedBlogs_updated);
		}
	}

	return (
		// TODO - need to change the 'active' styling when you click the 'here' link text
		// TODO - add the date posted to the divs as well
		// TODO - add logic to display text if the user doesn't have any blogs posted
		// TODO - look into whether or not the way you have the publish/unpublish logic
		// TODO - need to figure out how to make the account's num blogs counter go down without doing a page refresh when the user deletes a blog
		// TODO - redesign the blog posts layout/divs
		// TODO - on the page that displays the blog, add logic to prevent users from reading the blog if it's been unpublished

		<>
			<div className={profile_css.blogsContainer}>
				<div className={profile_css.blogsSearchContainer}>
					<input type="search" placeholder="Search by title" />
				</div>
				<div className={profile_css.blogs}>
					{
						blogsToShow.length > 0 ? (
							blogsToShow.map((blog: Blog) => {
								return (
									<>
										{userData?.user_id === user_id ||
										(userData?.user_id !== user_id && blog.published) ? (
											<div
												className={profile_css.container}
												onClick={() =>
													navigate(
														`/blogs/${blog.route_id}/${blog.sanitized_title}`
													)
												}
												key={Math.floor(Math.random() * Date.now())}
											>
												<h2>{blog.blog_title.toUpperCase()}</h2>
												{blog.published ? (
													<p className={profile_css.statusFlair_published}>
														PUBLISHED
													</p>
												) : (
													<p className={profile_css.statusFlair_unpublished}>
														UNPUBLISHED
													</p>
												)}
												<div className={profile_css.summaryContainer}>
													<p>{blog.blog_summary}</p>
												</div>
												{userData?.user_id === user_id ? (
													<div className={profile_css.buttonGroup}>
														<button
															title="Archive"
															onClick={e => {
																e.stopPropagation();
																handleArchiveStatus(blog._id, true);
																archive(blog.route_id);
															}}
														>
															<FontAwesomeIcon icon={faBoxArchive} />
														</button>
														<button
															title={blog.published ? "Publish" : "Unpublish"}
															onClick={e => {
																e.stopPropagation();
																unPublish(blog.route_id);
																if (blog.published) {
																	handlePublishStatus(blog._id, false);
																} else {
																	handlePublishStatus(blog._id, true);
																}
															}}
														>
															{!blog.published ? (
																<FontAwesomeIcon icon={faEye} />
															) : (
																<FontAwesomeIcon icon={faEyeSlash} />
															)}
														</button>
														<button
															title="Delete"
															onClick={e => {
																e.stopPropagation();
																deleteBlog(blog._id);
																removeBlog(blog.route_id, blog.blog_title);
															}}
														>
															<FontAwesomeIcon icon={faTrash} />
														</button>
														<button
															title="Edit"
															onClick={e => e.stopPropagation()}
														>
															<FontAwesomeIcon icon={faPenToSquare} />
														</button>
													</div>
												) : null}
											</div>
										) : null}
									</>
								);
							})
						) : (
							<h3 className={profile_css.notice}>
								All of your blogs are archived. Click&nbsp;
								<Link
									to={`/user/${userData?.user_id}/profile/settings?section=archived-blogs`}
								>
									here
								</Link>
								&nbsp;to view them in your settings page
							</h3>
						)
						//   || (
						// 		<h3 className={profile_css.notice}>
						// 			This user does not have any blogs posted or published
						// 		</h3>
						//)
					}
				</div>
			</div>
		</>
	);
}
