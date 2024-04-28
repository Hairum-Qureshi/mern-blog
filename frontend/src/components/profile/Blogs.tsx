import { useEffect } from "react";
import useAuthContext from "../../contexts/authContext";
import useProfileData from "../../hooks/useProfileData";
import { useSettings } from "../../hooks/useSettings";
import { Link, useParams } from "react-router-dom";
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
	const { getProfileData, userProfileData, blogs } = useProfileData();

	useEffect(() => {
		if (user_id) {
			getProfileData(user_id);
		}
	}, [user_id]);

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
						blogs.map((blog: Blog, index: number) => (
							<Link
								to={`/blogs/${blog.route_id}/${blog.sanitized_title}`}
								key={index}
							>
								<div className={profile_css.container}>
									<h1>{blog.blog_title.toUpperCase()}</h1>
									{/* <div className={profile_css.imageBackground}>
									<img src={blog.blog_thumbnail} alt="Blog thumbnail" />
									<h2>{blog.blog_title.toUpperCase()}</h2>
								</div> */}
									<div className={profile_css.summaryContainer}>
										<p>{blog.blog_summary}</p>
									</div>
									<div className={profile_css.buttonGroup}>
										<button title="Archive">
											<FontAwesomeIcon icon={faBoxArchive} />
										</button>
										{/* ADD LOGIC WHERE IF THE BLOG IS UNPUBLISHED, CHANGE IT TO "PUBLISHED" WHEN THE USER CLICKS ON IT AND VICE VERSA. WILL ALSO NEED TO ADD LOGIC WHERE IF YOU ARCHIVE THE BLOG, THE UNPUBLISH BUTTONS BECOMES DISABLED (SINCE YOU CAN'T PUBLISH AN ARCHIVED BLOG) */}
										<button title="Unpublish">
											<FontAwesomeIcon icon={faEyeSlash} />
										</button>
										<button title="Delete">
											<FontAwesomeIcon icon={faTrash} />
										</button>
										<button title="Edit">
											<FontAwesomeIcon icon={faPenToSquare} />
										</button>
									</div>
								</div>
							</Link>
						))) ||
						"This user does not have any blogs posted"}
				</div>
			</div>
		</>
	);
}
