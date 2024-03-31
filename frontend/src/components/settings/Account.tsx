import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import settings_css from "./../../css/settings.module.css";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function Account() {
	return (
		<>
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
		</>
	);
}
