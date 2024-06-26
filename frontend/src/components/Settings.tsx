import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import settings_css from "../css/settings.module.css";
import {
	faArrowLeft,
	faBook,
	faCircleCheck,
	faCircleUser,
	faHashtag,
	faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { Link, useSearchParams } from "react-router-dom";
import Account from "./settings/Account";
import ArchivedBlogs from "./settings/ArchivedBlogs";
import BlockedList from "./settings/BlockedList";
import Security from "./settings/Security";
import Socials from "./settings/Socials";
import NotFound from "./NotFound";
import useAuthContext from "../contexts/authContext";

export default function Settings() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { userData } = useAuthContext()!;

	const query_params = [
		"account",
		"archived-blogs",
		"socials",
		"security",
		"blocked-users"
	];
	const current = searchParams.get("section");

	return userData && userData.message !== "user does not exist" ? (
		<div>
			<div className={settings_css.main}>
				<div className={settings_css.navbar}>
					<ul>
						<Link to={`/user/${userData && userData.user_id}/profile`}>
							<li>
								<span>
									<FontAwesomeIcon icon={faArrowLeft} />
								</span>
								&nbsp; GO BACK
							</li>
						</Link>
						<Link to="?section=account">
							<li>
								<span>
									<FontAwesomeIcon icon={faCircleUser} />
								</span>
								&nbsp; Account
							</li>
						</Link>
						<Link to="?section=archived-blogs">
							<li>
								<span>
									<FontAwesomeIcon icon={faBook} />
								</span>
								&nbsp; Archived Blogs
							</li>
						</Link>
						<Link to="?section=socials">
							<li>
								<span>
									<FontAwesomeIcon icon={faHashtag} />
								</span>
								&nbsp; Socials
							</li>
						</Link>
						{!userData.isGoogleAccount ? (
							<Link to="?section=security">
								<li>
									<span>
										<FontAwesomeIcon icon={faShieldHalved} />
									</span>
									&nbsp; Security
								</li>
							</Link>
						) : null}
						<Link to="?section=blocked-users">
							<li>
								<span>
									<FontAwesomeIcon icon={faCircleXmark} />
								</span>
								&nbsp; Blocked List
							</li>
						</Link>
					</ul>
				</div>
				{current === query_params[0] ? (
					<Account />
				) : current === query_params[1] ? (
					<ArchivedBlogs />
				) : current === query_params[2] ? (
					<Socials />
				) : current === query_params[3] && !userData.isGoogleAccount ? (
					<Security />
				) : current === query_params[4] ? (
					<BlockedList />
				) : (
					<NotFound />
				)}
			</div>
		</div>
	) : (
		<NotFound />
	);
}
