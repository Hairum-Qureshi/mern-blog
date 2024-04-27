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
import useProfileData from "../../hooks/useProfileData";
import { useEffect } from "react";

// TODO - for the social media icons, use an HTML table so they're neatly grouped
// TODO - figure out why the line breaks aren't being rendered for the user bio
// TODO - add dynamic CSS styling to the currently selected tab

export default function Biograpy() {
	const { userData } = useAuthContext()!;
	const { data } = useSettings();
	const { user_id } = useParams();
	const { getProfileData, userProfileData } = useProfileData();

	useEffect(() => {
		if (user_id) {
			getProfileData(user_id);
		}
	}, [user_id]);

	return (
		<>
			<div className={profile_css.socials}>
				{userData && userData.user_id === user_id ? (
					<h2>MY SOCIALS</h2>
				) : (
					<h2>
						{userData && userData?.user_id === user_id
							? userData.first_name.toUpperCase()
							: userProfileData?.first_name.toUpperCase()}
						'S SOCIALS
					</h2>
				)}
				<div className={profile_css.social_block}>
					{userData?.user_id === user_id && data?.social_media.twitter_x ? (
						<>
							<FontAwesomeIcon icon={faXTwitter} />
							:&nbsp;
							<span>{data?.social_media.twitter_x}</span>
						</>
					) : userData?.user_id !== user_id &&
					  userProfileData?.social_media.twitter_x ? (
						<>
							<FontAwesomeIcon icon={faXTwitter} />
							:&nbsp;
							<span>{userProfileData?.social_media.twitter_x}</span>
						</>
					) : null}
				</div>
				<div className={profile_css.social_block}>
					{userData?.user_id === user_id && data?.social_media.instagram ? (
						<>
							<FontAwesomeIcon icon={faInstagram} />
							:&nbsp;
							<span>{data?.social_media.instagram}</span>
							<br />
						</>
					) : userData?.user_id !== user_id &&
					  userProfileData?.social_media.instagram ? (
						<>
							<FontAwesomeIcon icon={faInstagram} />
							:&nbsp;
							<span>{userProfileData?.social_media.instagram}</span>
							<br />
						</>
					) : null}
				</div>
				<div className={profile_css.social_block}>
					{userData?.user_id === user_id && data?.social_media.facebook ? (
						<>
							<FontAwesomeIcon icon={faFacebook} />
							:&nbsp;
							<span>{data?.social_media.facebook}</span>
							<br />
						</>
					) : userData?.user_id !== user_id &&
					  userProfileData?.social_media.facebook ? (
						<>
							<FontAwesomeIcon icon={faFacebook} />
							:&nbsp;
							<span>{userProfileData?.social_media.facebook}</span>
							<br />
						</>
					) : null}
				</div>
				<div className={profile_css.social_block}>
					{userData?.user_id === user_id && data?.social_media.pinterest ? (
						<>
							<FontAwesomeIcon icon={faPinterest} />
							:&nbsp;
							<span>{data?.social_media.pinterest}</span>
							<br />
						</>
					) : userData?.user_id !== user_id &&
					  userProfileData?.social_media.pinterest ? (
						<>
							<FontAwesomeIcon icon={faPinterest} />
							:&nbsp;
							<span>{userProfileData?.social_media.pinterest}</span>
							<br />
						</>
					) : null}
				</div>
				<div className={profile_css.social_block}>
					{userData?.user_id === user_id && data?.social_media.discord ? (
						<>
							<FontAwesomeIcon icon={faDiscord} />
							:&nbsp;
							<span>{data?.social_media.discord}</span>
							<br />
						</>
					) : userData?.user_id !== user_id &&
					  userProfileData?.social_media.discord ? (
						<>
							<FontAwesomeIcon icon={faDiscord} />
							:&nbsp;
							<span>{userProfileData?.social_media.discord}</span>
							<br />
						</>
					) : null}
				</div>
				{userData?.user_id === user_id &&
				!data?.social_media.discord &&
				!data?.social_media.facebook &&
				!data?.social_media.instagram &&
				!data?.social_media.pinterest &&
				!data?.social_media.twitter_x ? (
					<h4>
						You currently don't have any social media accounts listed. <br />
						Head over to your settings page and add some!
					</h4>
				) : userData?.user_id !== user_id &&
				  !userProfileData?.social_media.discord &&
				  !userProfileData?.social_media.facebook &&
				  !userProfileData?.social_media.instagram &&
				  !userProfileData?.social_media.pinterest &&
				  !userProfileData?.social_media.twitter_x ? (
					<h4>
						{userProfileData?.first_name} currently don't have any social media
						accounts listed.
					</h4>
				) : null}
			</div>
			<div className={profile_css.biography}>
				<ReactMarkdown>
					{userData?.user_id === user_id
						? data?.biography
						: userProfileData?.biography}
				</ReactMarkdown>
			</div>
		</>
	);
}
