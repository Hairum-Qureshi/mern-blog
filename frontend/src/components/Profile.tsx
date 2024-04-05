import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import profile_css from "../css/profile.module.css";
import {
	faDiscord,
	faFacebook,
	faInstagram,
	faPinterest,
	faXTwitter
} from "@fortawesome/free-brands-svg-icons";
import useAuthContext from "../contexts/authContext";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
// import { useEffect, useState } from "react";
// import { User } from "../interfaces";

export default function Profile() {
	const { userData } = useAuthContext()!;
	const { user_id } = useParams();
	const navigate = useNavigate();

	console.log(userData);

	return userData ? (
		<>
			<div className={profile_css.headerWrapper}>
				{/* DO NOT REMOVE: */}
				<header></header>
				<div className={profile_css.colsContainer}>
					<div className={profile_css.leftCol}>
						<div className={profile_css.imgContainer}>
							<img src={userData.profile_picture} alt="User profile picture" />
							{/* Used to show online/offline status circle: */}
							{/* <span></span> */}
						</div>
						<h2>{userData.full_name}</h2>
						<p>Activist Blogger</p>
						<p>user@example.com</p>

						<ul className={profile_css.about}>
							<li>
								<span>0</span>Followers
							</li>
							<li>
								<span>0</span>Following
							</li>
							<li>
								<span>{userData.num_blogs}</span>Blog Posts
							</li>
						</ul>

						<div className={profile_css.content}>
							<p>
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
								Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur
								adipisicing elit. Quisquam ex tempora consectetur impedit unde
								consequatur voluptate eius laborum aliquam, minima est nam
								facere praesentium. Facilis laboriosam totam hic odit cum!.
							</p>

							<ul>
								<li>
									<FontAwesomeIcon icon={faXTwitter} />
								</li>
								<li>
									<FontAwesomeIcon icon={faInstagram} />
								</li>
								<li>
									<FontAwesomeIcon icon={faFacebook} />
								</li>
								<li>
									<FontAwesomeIcon icon={faPinterest} />
								</li>
								<li>
									<FontAwesomeIcon icon={faDiscord} />
								</li>
							</ul>
						</div>
					</div>
					<div className={profile_css.rightCol}>
						<nav>
							<ul>
								<li>
									<h3>
										{userData.user_id === user_id
											? "YOUR BLOGS:"
											: `${userData.user_id === user_id}'s BLOGS`}
									</h3>
								</li>
								{/* <li>
								<a href="">galleries</a>
							</li>
							<li>
								<a href="">groups</a>
							</li> */}
								{/* <li>
								<a href="">about</a>
							</li> */}
							</ul>
							{userData.user_id === user_id ? (
								<>
									<button
										onClick={() =>
											navigate(
												`/user/${userData.user_id}/profile/settings?section=account`
											)
										}
									>
										SETTINGS
									</button>
									<button
										onClick={() =>
											navigate(`/user/${userData.user_id}/blogs/post`)
										}
									>
										POST BLOGS
									</button>
								</>
							) : (
								<button>FOLLOW</button>
							)}
						</nav>

						<div className={profile_css.blogs}>
							{userData.num_blogs == 0 ? (
								<h2>You currently don't have any blogs posted</h2>
							) : (
								// add logic to loop through and display all the blogs the user has created
								<div>
									<h4>Some Blog Title</h4>

									<img
										src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
										alt="Blog thumbnail"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	) : (
		<NotFound />
	);
}

/*

Base HTML Code from https://github.com/programmercloud/responsive-profile-page 
Modified by Hairum

*/
