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
				{data?.social_media.twitter_x ? (
					<>
						<FontAwesomeIcon icon={faXTwitter} />:
						<span>${data?.social_media.twitter_x}</span>
					</>
				) : null}
				{data?.social_media.twitter_x ? (
					<>
						<FontAwesomeIcon icon={faXTwitter} />:
						<span>${data?.social_media.twitter_x}</span>
					</>
				) : null}
				{data?.social_media.instagram ? (
					<>
						<FontAwesomeIcon icon={faInstagram} />:
						<span>${data?.social_media.instagram}</span>
					</>
				) : null}
				{data?.social_media.facebook ? (
					<>
						<FontAwesomeIcon icon={faFacebook} />:
						<span>${data?.social_media.facebook}</span>
					</>
				) : null}
				{data?.social_media.pinterest ? (
					<>
						<FontAwesomeIcon icon={faPinterest} />:
						<span>${data?.social_media.pinterest}</span>
					</>
				) : null}
				{data?.social_media.discord ? (
					<>
						<FontAwesomeIcon icon={faDiscord} />:
						<span>${data?.social_media.discord}</span>
					</>
				) : null}
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
