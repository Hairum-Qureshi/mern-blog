import settings_css from "./../../css/settings.module.css";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";

export default function Security() {
	const { userData } = useAuthContext()!;

	return userData ? (
		<>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>SECURITY - CHANGE ACCOUNT PASSWORD</h3>
				</div>
				<div className={settings_css.section}>
					<p>Some Warning Message Here</p>
				</div>
				<div className={settings_css.section}>
					<input type="email" placeholder="Email" />
				</div>
				<div className={settings_css.section}>
					<input type="password" placeholder="Password" />
				</div>
				<div className={settings_css.section}>
					<input type="password" placeholder="Confirm Password" />
				</div>
			</div>
		</>
	) : (
		<NotFound />
	);
}
