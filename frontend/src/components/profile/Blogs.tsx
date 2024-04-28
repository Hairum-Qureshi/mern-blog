import { useEffect } from "react";
import useAuthContext from "../../contexts/authContext";
import useProfileData from "../../hooks/useProfileData";
import { useSettings } from "../../hooks/useSettings";
import { useNavigate, useParams } from "react-router-dom";
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
						blogs.map((blog: Blog) => (
							<div
								className={profile_css.container}
								onClick={() =>
									navigate(`/blogs/${blog.route_id}/${blog.sanitized_title}`)
								}
								key={Math.floor(Math.random() * Date.now())}
							>
								<h1>{blog.blog_title.toUpperCase()}</h1>
								<div className={profile_css.summaryContainer}>
									<p>{blog.blog_summary}</p>
								</div>
								<div className={profile_css.buttonGroup}>
									<button
										title="Archive"
										onClick={e => {
											e.stopPropagation();
										}}
									>
										<FontAwesomeIcon icon={faBoxArchive} />
									</button>
									<button title="Unpublish" onClick={e => e.stopPropagation()}>
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
						))) ||
						"This user does not have any blogs posted"}
				</div>
			</div>
		</>
	);
}
