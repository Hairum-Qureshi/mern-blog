import settings_css from "./../../css/settings.module.css";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";

export default function BlockedList() {
	const { userData } = useAuthContext()!;

	return userData && userData.message !== "user does not exist" ? (
		<div className={settings_css.mainBody}>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>Your Blocked List</h3>
				</div>
				{userData.blocked_users.length === 0 ? (
					<div className={settings_css.section}>
						<p>You currently don't have anyone blocked.</p>
					</div>
				) : (
					userData.blocked_users.map(user => (
						<div className={settings_css.section}>
							{user} <button>Unblock</button>
						</div>
					))
				)}
			</div>
		</div>
	) : (
		<NotFound />
	);
}
