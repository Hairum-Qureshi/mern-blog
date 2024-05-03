import settings_css from "./../../css/settings.module.css";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";
import useProfileData from "../../hooks/useProfileData";
import { useEffect, useState } from "react";
import { Blog } from "../../interfaces";

export default function ArchivedBlogs() {
	const { userData } = useAuthContext()!;
	const { getProfileData, blogs, handleArchiveStatus } = useProfileData();

	const [archivedBlogs, setArchivedBlogs] = useState<Blog[]>([]);

	useEffect(() => {
		if (userData) {
			getProfileData(userData.user_id);
		}
	}, []);

	useEffect(() => {
		if (blogs) {
			const archivedBlogs: Blog[] = blogs.filter((blog: Blog) => {
				return blog.archived;
			});
			setArchivedBlogs(archivedBlogs);
		}
	}, [blogs]);

	function unArchiveBlog(blog_id: string) {
		const unArchivedBlogs_updated: Blog[] = archivedBlogs.filter(
			(blog: Blog) => blog.route_id !== blog_id
		);
		setArchivedBlogs(unArchivedBlogs_updated);
	}

	return userData && userData.message !== "user does not exist" ? (
		<>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>Your Archived Blogs</h3>
				</div>
				{archivedBlogs.length > 0 ? (
					archivedBlogs.map((blog: Blog) => {
						return blog.archived ? (
							<div
								className={settings_css.section}
								key={Math.floor(Math.random() * Date.now())}
							>
								<div className={settings_css.group}>
									<h3 className={settings_css.blogTitle}>{blog.blog_title}</h3>
									<button
										onClick={() => {
											unArchiveBlog(blog.route_id);
											handleArchiveStatus(blog._id, false);
										}}
									>
										UNARCHIVE
									</button>
								</div>
								<p>{blog.blog_summary}</p>
							</div>
						) : null;
					})
				) : (
					<div className={settings_css.section}>
						<h3>You currently don't have any archived blogs</h3>
					</div>
				)}
			</div>
		</>
	) : (
		<NotFound />
	);
}
