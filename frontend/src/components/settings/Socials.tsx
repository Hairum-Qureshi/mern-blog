import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import settings_css from "./../../css/settings.module.css";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import {
	faDiscord,
	faFacebook,
	faInstagram,
	faPinterest,
	faXTwitter
} from "@fortawesome/free-brands-svg-icons";

export default function Socials() {
	return (
		<>
			<h2>Socials</h2>
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
					<div className={settings_css.iconsContainer}>
						<table>
							<tr>
								<td align="right">
									<FontAwesomeIcon icon={faXTwitter} />
								</td>
								<td align="left">
									<input
										type="text"
										placeholder="X/Twitter Username"
										className={settings_css.socialUsername}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<FontAwesomeIcon icon={faInstagram} />
								</td>
								<td align="left">
									<input
										type="text"
										placeholder="Instagram Username"
										className={settings_css.socialUsername}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<FontAwesomeIcon icon={faFacebook} />
								</td>
								<td align="left">
									<input
										type="text"
										placeholder="Facebook Username"
										className={settings_css.socialUsername}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<FontAwesomeIcon icon={faPinterest} />
								</td>
								<td align="left">
									<input
										type="text"
										placeholder="Pinterest Username"
										className={settings_css.socialUsername}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<FontAwesomeIcon icon={faDiscord} />
								</td>
								<td align="left">
									<input
										type="text"
										placeholder="Discord Username"
										className={settings_css.socialUsername}
									/>
								</td>
							</tr>
						</table>
						{/* <div>
							<span className={settings_css.socialIcons}>
								<FontAwesomeIcon icon={faXTwitter} />
							</span>
							<input
								type="text"
								placeholder="X/Twitter Username"
								className={settings_css.socialUsername}
							/>
						</div>
						<div>
							<span className={settings_css.socialIcons}>
								<FontAwesomeIcon icon={faInstagram} />
							</span>
							<input
								type="text"
								placeholder="Instagram Username"
								className={settings_css.socialUsername}
							/>
						</div>
						<div>
							<span className={settings_css.socialIcons}>
								<FontAwesomeIcon icon={faFacebook} />
							</span>
							<input
								type="text"
								placeholder="Facebook Username"
								className={settings_css.socialUsername}
							/>
						</div>
						<div>
							<span className={settings_css.socialIcons}>
								<FontAwesomeIcon icon={faPinterest} />
							</span>
							<input
								type="text"
								placeholder="Pinterest Username"
								className={settings_css.socialUsername}
							/>
						</div>
						<div>
							<span className={settings_css.socialIcons}>
								<FontAwesomeIcon icon={faDiscord} />
							</span>
							<input
								type="text"
								placeholder="Discord Username"
								className={settings_css.socialUsername}
							/>
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
}
