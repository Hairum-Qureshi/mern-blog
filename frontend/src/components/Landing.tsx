import landing_css from "../css/landing.module.css";
import useAuthContext from "../contexts/authContext";
import NotFound from "./NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarDays,
	faComment,
	faTags,
	faUser
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Landing() {
	const { userData } = useAuthContext()!;

	// When retrieving all the blogs, you'll need to do some pagination and you'll need to handle the case where there are no blogs. If there are no blogs posted, you'll get back '{ message: "no blogs" }'

	return userData && userData.message !== "user does not exist" ? (
		<div className={landing_css.main}>
			<div className={landing_css.blogsContainer}>
				<div className={landing_css.blogBlock}>
					<h3 className={landing_css.title}>Blog Title Placeholder</h3>
					<hr />
					<div className={landing_css.blogData}>
						<p>
							<span>
								<FontAwesomeIcon icon={faUser} />
							</span>
							<Link to="#">Username</Link>
							<span>
								<FontAwesomeIcon icon={faCalendarDays} />
							</span>
							<Link to="#">May 10th, 2022</Link>
							<span>
								<FontAwesomeIcon icon={faComment} />
							</span>
							<Link to="#">23 Comments</Link>
							<span>
								<FontAwesomeIcon icon={faTags} /> Tags:
							</span>
							<div className={landing_css.tag}>home</div>
							<div className={landing_css.tag}>cooking</div>
						</p>
					</div>
					<hr />
					<div className={landing_css.blogPreviewContentContainer}>
						<div className={landing_css.blogThumbnailContainer}>
							<img
								src="https://wallpapers.com/images/hd/night-city-aesthetic-kaenr4i7e1u6t333.jpg"
								alt="Blog Thumbnail"
							/>
						</div>
						<div className={landing_css.blogSummaryContainer}>
							<p>
								Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi
								dolores aliquam iusto eum quam, consequuntur illum et dolorum
								unde doloribus voluptatibus magni laborum? Saepe eos iure libero
								sequi tempore necessitatibus.
							</p>
							<button>Read More</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className={landing_css.main}>User is not logged in</div>
	);
}
