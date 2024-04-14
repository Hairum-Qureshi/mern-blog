import profile_css from "../../css/profile.module.css";
import ReactMarkdown from "react-markdown";
import { useSettings } from "../../hooks/useSettings";
import useAuthContext from "../../contexts/authContext";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faDiscord,
	faFacebook,
	faInstagram,
	faPinterest,
	faXTwitter
} from "@fortawesome/free-brands-svg-icons";

// TODO - for the social media icons, use an HTML table so they're neatly grouped
// TODO - figure out why the line breaks aren't being rendered for the user bio
// TODO - add dynamic CSS styling to the currently selected tab

export default function Biograpy() {
	const { userData } = useAuthContext()!;
	const { data } = useSettings();
	const { user_id } = useParams();

	return (
		<>
			<div className={profile_css.socials}>
				{userData && userData.user_id === user_id ? (
					<h2>MY SOCIALS</h2>
				) : (
					<h2>{userData && userData.first_name}'s SOCIALS</h2>
				)}
				<div className={profile_css.social_block}>
					{data?.social_media.twitter_x ? (
						<>
							<FontAwesomeIcon icon={faXTwitter} />
							:&nbsp;
							<span>{data?.social_media.twitter_x}</span>
						</>
					) : null}
				</div>
				<div className={profile_css.social_block}>
					{data?.social_media.instagram ? (
						<>
							<FontAwesomeIcon icon={faInstagram} />
							:&nbsp;
							<span>{data?.social_media.instagram}</span>
							<br />
						</>
					) : null}
				</div>
				<div className={profile_css.social_block}>
					{data?.social_media.facebook ? (
						<>
							<FontAwesomeIcon icon={faFacebook} />
							:&nbsp;
							<span>{data?.social_media.facebook}</span>
							<br />
						</>
					) : null}
				</div>
				<div className={profile_css.social_block}>
					{data?.social_media.pinterest ? (
						<>
							<FontAwesomeIcon icon={faPinterest} />
							:&nbsp;
							<span>{data?.social_media.pinterest}</span>
							<br />
						</>
					) : null}
				</div>
				<div className={profile_css.social_block}>
					{data?.social_media.discord ? (
						<>
							<FontAwesomeIcon icon={faDiscord} />
							:&nbsp;
							<span>{data?.social_media.discord}</span>
							<br />
						</>
					) : null}
				</div>
				{!data?.social_media.discord &&
				!data?.social_media.facebook &&
				!data?.social_media.instagram &&
				!data?.social_media.pinterest &&
				!data?.social_media.twitter_x &&
				userData &&
				userData.user_id === user_id ? (
					<h4>
						You currently don't have any social media accounts listed. Head over
						to your settings page and add some!
					</h4>
				) : !data?.social_media.discord &&
				  !data?.social_media.facebook &&
				  !data?.social_media.instagram &&
				  !data?.social_media.pinterest &&
				  !data?.social_media.twitter_x &&
				  userData &&
				  userData.user_id !== user_id ? (
					<h4>
						{userData.first_name} currently doesn't have any social media
						accounts listed
					</h4>
				) : null}
			</div>
			<div className={profile_css.biography}>
				<ReactMarkdown>{data?.biography}</ReactMarkdown>
			</div>
		</>
	);
}
