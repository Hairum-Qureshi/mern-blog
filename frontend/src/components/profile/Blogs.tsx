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
	faPenToSquare,
	faTrash
} from "@fortawesome/free-solid-svg-icons";
import { Blog } from "../../interfaces";

export default function Blogs() {
	const { userData } = useAuthContext()!;
	const { data } = useSettings();
	const { user_id } = useParams();
	const { getProfileData, userProfileData, blogs, archiveBlog } =
		useProfileData();
	const [nonArchivedBlogs, setNonArchivedBlogs] = useState<Blog[]>([]);

	useEffect(() => {
		if (user_id) {
			getProfileData(user_id);
		}
	}, [user_id]);

	useEffect(() => {
		if (blogs) {
			const nonArchived_blogs: Blog[] = blogs.filter((blog: Blog) => {
				return !blog.archived;
			});
			setNonArchivedBlogs(nonArchived_blogs);
		}
	}, [blogs]);

	const navigate = useNavigate();

	function archive(blog_id: string) {
		const nonArchivedBlogs_updated: Blog[] = nonArchivedBlogs.filter(
			(blog: Blog) => blog.route_id !== blog_id
		);
		setNonArchivedBlogs(nonArchivedBlogs_updated);
	}

	return (
		// TODO - need to add logic to hide the buttons if the user visits another user's profile page's blog tab
		// TODO - need to change the 'active' styling when you click the 'here' link text
		// TODO - add the date posted to the divs as well
		// TODO - add logic to display text if the user doesn't have any blogs posted

		<>
			<div className={profile_css.blogsContainer}>
				<div className={profile_css.blogsSearchContainer}>
					<input type="search" placeholder="Search by title" />
				</div>
				<div className={profile_css.blogs}>
					{
						nonArchivedBlogs.length > 0 ? (
							nonArchivedBlogs.map((blog: Blog) => {
								return (
									<>
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
											<div className={profile_css.buttonGroup}>
												<button
													title="Archive"
													onClick={e => {
														e.stopPropagation();
														archiveBlog(blog.route_id, true);
														archive(blog.route_id);
													}}
												>
													<FontAwesomeIcon icon={faBoxArchive} />
												</button>
												<button
													title="Unpublish"
													onClick={e => e.stopPropagation()}
												>
													<FontAwesomeIcon icon={faEyeSlash} />
												</button>
												<button
													title="Delete"
													onClick={e => e.stopPropagation()}
												>
													<FontAwesomeIcon icon={faTrash} />
												</button>
												<button title="Edit" onClick={e => e.stopPropagation()}>
													<FontAwesomeIcon icon={faPenToSquare} />
												</button>
											</div>
										</div>
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
