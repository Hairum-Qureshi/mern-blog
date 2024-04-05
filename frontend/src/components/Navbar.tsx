import { Link, useLocation } from "react-router-dom";
import nav_css from "../css/navbar.module.css";
import useAuthContext from "../contexts/authContext";

export default function Navbar() {
	const location = useLocation();
	const { userData, signOut } = useAuthContext()!;

	return (
		<>
			{!(
				location.pathname.includes("/sign-up") ||
				location.pathname.includes("/sign-in") ||
				location.pathname.includes("/forgot-password")
			) && (
				<div className={nav_css.navbar}>
					<Link to="/">
						<h2>Digital Dialogue</h2>
					</Link>

					<ul>
						<li>
							<Link to="/about">ABOUT</Link>
						</li>
						{!userData ? (
							<li>
								<Link to="/sign-up">CREATE AN ACCOUNT</Link>
							</li>
						) : null}
						{!userData ? (
							<li>
								<Link to="/sign-in">LOGIN</Link>
							</li>
						) : null}
						{userData ? (
							<li>
								<Link to={`/user/${userData.user_id}/profile`}>PROFILE</Link>
							</li>
						) : null}
						{userData ? (
							<li onClick={signOut}>
								<Link to="/">LOGOUT</Link>
							</li>
						) : null}
					</ul>
				</div>
			)}
		</>
	);
}
