import settings_css from "./../../css/settings.module.css";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";

export default function ArchivedBlogs() {
	const { userData } = useAuthContext()!;

	return userData && userData.message !== "user does not exist" ? (
		<>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>Your Archived Blogs</h3>
				</div>
				<div className={settings_css.section}></div>
				<div className={settings_css.section}></div>
				<div className={settings_css.section}></div>
			</div>
		</>
	) : (
		<NotFound />
	);
}
