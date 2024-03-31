import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import profile_css from "../css/profile.module.css";
import {
	faDiscord,
	faFacebook,
	faInstagram,
	faPinterest,
	faXTwitter
} from "@fortawesome/free-brands-svg-icons";

export default function Profile() {
	return (
		<>
			<div className={profile_css.headerWrapper}>
				<header></header>
				<div className={profile_css.colsContainer}>
					<div className={profile_css.leftCol}>
						<div className={profile_css.imgContainer}>
							<img
								src="https://static.wikia.nocookie.net/d92f8304-34eb-4769-b050-47c68421cd9b/scale-to-width/370"
								alt="User profile picture"
							/>
							{/* <span></span> */}
						</div>
						<h2>John Doe</h2>
						<p>Activist Blogger</p>
						<p>user@example.com</p>

						<ul className={profile_css.about}>
							<li>
								<span>4,073</span>Followers
							</li>
							<li>
								<span>322</span>Following
							</li>
							<li>
								<span>100</span>Blog Posts
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
									<h3>John Doe's Blogs</h3>
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
							<button>FOLLOW</button>
						</nav>

						<div className={profile_css.blogs}>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
							<div>
								<h4>Some Blog Title</h4>

								<img
									src="https://e0.pxfuel.com/wallpapers/1009/683/desktop-wallpaper-earth-earth-aesthetic.jpg"
									alt="Blog thumbnail"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

/*

Base HTML Code from https://github.com/programmercloud/responsive-profile-page 
Modified by Hairum

*/
