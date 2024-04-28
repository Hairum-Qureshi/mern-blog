import settings_css from "./../../css/settings.module.css";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";
import useProfileData from "../../hooks/useProfileData";
import { useEffect } from "react";
import { Blog } from "../../interfaces";

export default function ArchivedBlogs() {
	const { userData } = useAuthContext()!;
	const { getProfileData, blogs } = useProfileData();

	useEffect(() => {
		if (userData) {
			getProfileData(userData.user_id);
		}
	}, []);

	return userData && userData.message !== "user does not exist" ? (
		<>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>Your Archived Blogs</h3>
				</div>
				{blogs && blogs.length > 0
					? blogs.map((blog: Blog) => {
							return blog.archived ? (
								<div className={settings_css.section}>
									<div>
										<h3>{blog.blog_title}</h3>
										<p>{blog.blog_summary}</p>
										<button>Unarchive</button>
									</div>
								</div>
							) : null;
					  })
					: null}
				{/* {userData.archived_blogs.length === 0 ? (
					<>
						<div className={settings_css.section}>
							You currently don't have any blogs archived.
						</div>
					</>
				) : (
					userData.archived_blogs.map(blog => {
						return <div className={settings_css.section}>{blog}</div>;
					})
				)} */}
			</div>
		</>
	) : (
		<NotFound />
	);
}
