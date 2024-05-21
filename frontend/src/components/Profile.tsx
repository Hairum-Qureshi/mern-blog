import useAuthContext from "../contexts/authContext";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { useSettings } from "../hooks/useSettings";
import Biography from "./profile/Biography";
import Blogs from "./profile/Blogs";
import { useEffect, useState } from "react";
import profile_css from "../css/profile.module.css";
import useProfileData from "../hooks/useProfileData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";

// TODO - need to add a block button visible for users visiting other users' profile pages
// TODO - add styling to the block button

export default function Profile() {
	const [selectedTab, setSelectedTab] = useState("biography");

	const { userData } = useAuthContext()!;
	const { user_id } = useParams();
	const navigate = useNavigate();
	const { data } = useSettings();
	const { getProfileData, userProfileData, handleNotifications } =
		useProfileData();

	useEffect(() => {
		if (user_id) {
			getProfileData(user_id);
		}
	}, [user_id]);

	return userData &&
		userData.message !== "user does not exist" &&
		userProfileData &&
		userProfileData.message !== "user not found" ? (
		<div className={profile_css.main}>
			<div className={profile_css.topSection}>
				<img
					src={
						userData.user_id === user_id
							? data?.backdrop
							: userProfileData?.backdrop
					}
					alt="User profile backdrop"
				/>
				<div className={profile_css.leftSection}>
					<div className={profile_css.pfpContainer}>
						<img
							src={
								userData.user_id === user_id
									? data?.profile_picture
									: userProfileData?.profile_picture
							}
							alt="User profile picture"
						/>
					</div>
					<div className={profile_css.userInfoContainer}>
						<h1>
							{userData.user_id === user_id
								? data?.full_name
								: userProfileData?.full_name}
						</h1>
						<h3>
							{userData.user_id === user_id
								? data?.show_email
									? data?.email
									: null
								: userProfileData?.show_email
								? userProfileData?.show_email
								: null}
						</h3>
						{userData.user_id === user_id ? (
							<>
								<button
									onClick={() =>
										navigate(
											`/user/${userData.user_id}/profile/settings?section=account`
										)
									}
								>
									Settings
								</button>
								<button
									onClick={() =>
										navigate(`/user/${userData.user_id}/blog/create`)
									}
								>
									Post Blog
								</button>
							</>
						) : (
							<>
								<button>FOLLOW</button>
								<button>BLOCK</button>
								{user_id &&
								!userData.postNotifEnabledAccounts.includes(user_id) ? (
									<button
										title="Enable Post Notifications"
										onClick={() =>
											user_id && handleNotifications(user_id, true)
										}
									>
										<FontAwesomeIcon icon={faBellSlash} />
									</button>
								) : (
									<button
										title="Mute Post Notifications"
										onClick={() =>
											user_id && handleNotifications(user_id, false)
										}
									>
										<FontAwesomeIcon icon={faBell} />
									</button>
								)}
							</>
						)}
					</div>
				</div>
				<div className={profile_css.rightSection}>
					<div className={profile_css.userStats}>
						<div className={profile_css.followersContainer}>
							<div>
								<h1>{data?.followers}</h1>
							</div>
							<div>FOLLOWERS</div>
						</div>
						<div className={profile_css.followingsContainer}>
							<div>
								<h1>{data?.following}</h1>
							</div>
							<div>FOLLOWING</div>
						</div>
						<div className={profile_css.blogsCountContainer}>
							<div>
								<h1>
									{userData?.user_id === user_id
										? data?.num_blogs
										: userProfileData?.num_blogs}
								</h1>
							</div>
							<div>BLOGS</div>
						</div>
					</div>
				</div>
			</div>
			<div className={profile_css.bottomSection}>
				<div className={profile_css.navigation}>
					<div
						className={profile_css.navButton}
						onClick={() => setSelectedTab("biography")}
					>
						<h3>BIOGRAPHY</h3>
					</div>
					<div
						className={profile_css.navButton}
						onClick={() => setSelectedTab("blogs")}
					>
						<h3>BLOG POSTS</h3>
					</div>
				</div>
				<div className={profile_css.content}>
					{selectedTab === "biography" ? <Biography /> : <Blogs />}
				</div>
			</div>
		</div>
	) : (
		<NotFound />
	);
}
