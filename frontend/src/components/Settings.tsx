import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import settings_css from "../css/settings.module.css";
import {
	faBook,
	faCircleCheck,
	faCircleUser,
	faHashtag,
	faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

export default function Settings() {
	return (
		<div className={settings_css.main}>
			<div className={settings_css.navbar}>
				<ul>
					<li>
						<span>
							<FontAwesomeIcon icon={faCircleUser} />
						</span>
						&nbsp; Account
					</li>
					<li>
						<span>
							<FontAwesomeIcon icon={faBook} />
						</span>
						&nbsp; Archived Blogs
					</li>
					<li>
						<span>
							<FontAwesomeIcon icon={faHashtag} />
						</span>
						&nbsp; Socials
					</li>
					<li>
						<span>
							<FontAwesomeIcon icon={faShieldHalved} />
						</span>
						&nbsp; Security
					</li>
					<li>
						<span>
							<FontAwesomeIcon icon={faCircleXmark} />
						</span>
						&nbsp; Blocked List
					</li>
				</ul>
			</div>
			<div className={settings_css.settingsContainer}>
				<h2>Account</h2>
				<div className={settings_css.userSettings}>
					<div className={settings_css.inputContainer}>
						<p>
							Changes Saved &nbsp;
							<span>
								<FontAwesomeIcon icon={faCircleCheck} />
							</span>
						</p>
						{/* <p style={{ color: "red" }}>
							Problem Saving Changes &nbsp;
							<span>
								<FontAwesomeIcon icon={faCircleXmark} />
							</span>
						</p> */}
						<div className={settings_css.split}>
							<input type="text" placeholder="First Name" />
							<input type="text" placeholder="Last Name" />
						</div>
						<div className={settings_css.whole}>
							<input type="email" placeholder="Email" />
							<textarea placeholder="Biography"></textarea>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
