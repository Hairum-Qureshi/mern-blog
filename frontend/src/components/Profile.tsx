import useAuthContext from "../contexts/authContext";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { useSettings } from "../hooks/useSettings";
import Biography from "./profile/Biography";
import Blogs from "./profile/Blogs";
import { useState } from "react";
import profile_css from "../css/profile.module.css";

// TODO - need to add a block button visible for users visiting other users' profile pages

export default function Profile() {
	const { userData } = useAuthContext()!;
	const { user_id } = useParams();
	const navigate = useNavigate();
	const { data } = useSettings();
	const [selectedTab, setSelectedTab] = useState("biography");

	return userData && userData.message !== "user does not exist" ? (
		<>
			<div className={profile_css.topSection}>
				<img src={data?.backdrop} alt="User profile backdrop" />
				<div className={profile_css.leftSection}>
					<div className={profile_css.pfpContainer}>
						<img src={data?.profile_picture} alt="User profile picture" />
					</div>
					<div className={profile_css.userInfoContainer}>
						<h1>{data?.full_name}</h1>
						<h3>test@gmail.com</h3>
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
							</>
						) : (
							<button>FOLLOW</button>
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
								<h1>{data?.num_blogs}</h1>
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
					{/* <div className={profile_css.navButton}>
						<h3>SOCIALS</h3>
					</div> */}
				</div>
				<div className={profile_css.content}>
					{selectedTab === "biography" ? <Biography /> : <Blogs />}
				</div>
			</div>
		</>
	) : (
		<NotFound />
	);
}
