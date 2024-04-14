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
import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useSettings";

export default function Socials() {
	const { userData } = useAuthContext()!;
	const { data, showSavingStatus, saving, autoSaveSocials } = useSettings();

	const [twitterXUser, setTwitterXUser] = useState<string>();
	const [instagramUser, setInstagramUser] = useState<string>();
	const [facebookUser, setFacebookUser] = useState<string>();
	const [pinterestUser, setPinterestUser] = useState<string>();
	const [discordUser, setDiscordUser] = useState<string>();

	useEffect(() => {
		if (data && userData) {
			setTwitterXUser(data.social_media.twitter_x); // 1
			setInstagramUser(data.social_media.instagram); // 2
			setFacebookUser(data.social_media.facebook); // 3
			setPinterestUser(data.social_media.pinterest); // 4
			setDiscordUser(data.social_media.discord); // 5
		}
	}, [data]);

	return userData ? (
		<>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>SOCIAL MEDIA</h3>
					{saving ? (
						<span>Saving...</span>
					) : (
						<span>
							Saved <FontAwesomeIcon icon={faCircleCheck} />
						</span>
					)}
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
						value={twitterXUser}
						onChange={e => {
							setTwitterXUser(e.target.value);
							showSavingStatus();
						}}
						onBlur={() => autoSaveSocials(1, twitterXUser!)}
					/>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faInstagram} />
					</span>
					<input
						type="text"
						placeholder="Instagram"
						value={instagramUser}
						onChange={e => {
							setInstagramUser(e.target.value);
							showSavingStatus();
						}}
						onBlur={() => autoSaveSocials(2, instagramUser!)}
					/>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faFacebook} />
					</span>
					<input
						type="text"
						placeholder="Facebook"
						value={facebookUser}
						onChange={e => {
							setFacebookUser(e.target.value);
							showSavingStatus();
						}}
						onBlur={() => autoSaveSocials(3, facebookUser!)}
					/>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faPinterest} />
					</span>
					<input
						type="text"
						placeholder="Pinterest"
						value={pinterestUser}
						onChange={e => {
							setPinterestUser(e.target.value);
							showSavingStatus();
						}}
						onBlur={() => autoSaveSocials(4, pinterestUser!)}
					/>
				</div>
				<div className={settings_css.section}>
					<span>
						<FontAwesomeIcon icon={faDiscord} />
					</span>
					<input
						type="text"
						placeholder="Discord"
						value={discordUser}
						onChange={e => {
							setDiscordUser(e.target.value);
							showSavingStatus();
						}}
						onBlur={() => autoSaveSocials(5, discordUser!)}
					/>
				</div>
			</div>
		</>
	) : (
		<NotFound />
	);
}
