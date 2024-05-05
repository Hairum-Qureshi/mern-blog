import settings_css from "./../../css/settings.module.css";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";
import { useState } from "react";

export default function Security() {
	const { userData } = useAuthContext()!;

	const [password, setPassword] = useState<string>();
	const [duplicatePassword, setDuplicatePassword] = useState<string>();

	// TODO - if the user signed up with Google, have this disabled

	return userData && userData.message !== "user does not exist" ? (
		<div className={settings_css.mainBody}>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>SECURITY - CHANGE ACCOUNT PASSWORD</h3>
				</div>
				<div className={settings_css.section}>
					<input
						type="email"
						placeholder="Email"
						value={userData.email}
						disabled={userData.isGoogleAccount}
					/>
				</div>
				<div className={settings_css.section}>
					<input
						type="password"
						placeholder="Password"
						value={userData.isGoogleAccount ? "" : password}
						disabled={userData.isGoogleAccount}
					/>
				</div>
				<div className={settings_css.section}>
					<input
						type="password"
						placeholder="Confirm Password"
						value={userData.isGoogleAccount ? "" : duplicatePassword}
						disabled={userData.isGoogleAccount}
					/>
				</div>
			</div>
		</div>
	) : (
		<NotFound />
	);
}
