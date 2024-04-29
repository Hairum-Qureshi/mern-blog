import { useEffect } from "react";
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

	useEffect(() => {
		if (user_id) {
			getProfileData(user_id);
		}
	}, [user_id]);

	const navigate = useNavigate();

	return (
		// TODO - NEED TO ADD LOGIC TO HIDE THE BUTTONS IF THE USER VISITS ANOTHER USER'S PROFILE PAGE'S BLOG TAB
		<>
			<div className={profile_css.blogsContainer}>
				<div className={profile_css.blogsSearchContainer}>
					<input type="search" placeholder="Search by title" />
				</div>
				<div className={profile_css.blogs}>
					{(blogs &&
						blogs.length > 0 &&
						blogs.map((blog: Blog) =>
							!blog.archived ? (
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
										<h1>{blog.blog_title.toUpperCase()}</h1>
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
													archiveBlog(userData?.user_id, blog.route_id);
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
											<button title="Delete" onClick={e => e.stopPropagation()}>
												<FontAwesomeIcon icon={faTrash} />
											</button>
											<button title="Edit" onClick={e => e.stopPropagation()}>
												<FontAwesomeIcon icon={faPenToSquare} />
											</button>
										</div>
									</div>
								</>
							) : blogs.indexOf(blog) === blogs.length - 1 ? (
								<h3 className={profile_css.notice}>
									All of your blogs are archived. Click&nbsp;
									<Link
										to={`/user/${userData?.user_id}/profile/settings?section=archived-blogs`}
									>
										here
									</Link>
									&nbsp;to view them in your settings page
								</h3>
							) : null
						)) || (
						<h3 className={profile_css.notice}>
							This user does not have any blogs posted or published
						</h3>
					)}
				</div>
			</div>
		</>
	);
}
