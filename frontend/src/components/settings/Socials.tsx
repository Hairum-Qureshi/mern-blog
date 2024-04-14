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
import NotFound from "../NotFound";
import useAuthContext from "../../contexts/authContext";
import { useState } from "react";

export default function Socials() {
	const { userData } = useAuthContext()!;

	const [twitterXUser, setTwitterXUser] = useState<string>();
	const [instagramUser, setInstagramUser] = useState<string>();
	const [facebookUser, setFacebookUser] = useState<string>();
	const [pinterestUser, setPinterestUser] = useState<string>();
	const [discordUser, setDiscordUser] = useState<string>();

	return userData ? (
		<>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>SOCIAL MEDIA</h3>
				</div>
				<div className={settings_css.section}>
					<p>
						<b>NOTE:</b> adding your usernames guarantees your social media
						accounts will be made public on your profile.
					</p>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faXTwitter} />
					</span>
					<input
						type="text"
						placeholder="Twitter/X"
						value={
							userData.social_media.twitter_x
								? userData.social_media.twitter_x
								: ""
						}
					/>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faInstagram} />
					</span>
					<input
						type="text"
						placeholder="Instagram"
						value={
							userData.social_media.instagram
								? userData.social_media.instagram
								: ""
						}
					/>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faFacebook} />
					</span>
					<input
						type="text"
						placeholder="Facebook"
						value={
							userData.social_media.facebook
								? userData.social_media.facebook
								: ""
						}
					/>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faPinterest} />
					</span>
					<input
						type="text"
						placeholder="Pinterest"
						value={
							userData.social_media.pinterest
								? userData.social_media.pinterest
								: ""
						}
					/>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faDiscord} />
					</span>
					<input
						type="text"
						placeholder="Discord"
						value={
							userData.social_media.discord ? userData.social_media.discord : ""
						}
					/>
				</div>
			</div>
		</>
	) : (
		<NotFound />
	);
}
