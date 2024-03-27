import { Link, useLocation } from "react-router-dom";
import nav_css from "../css/navbar.module.css";

export default function Navbar() {
	const location = useLocation();

	return (
		<>
			{!(
				location.pathname.includes("/sign-up") ||
				location.pathname.includes("/sign-in") ||
				location.pathname.includes("/forgot-password")
			) && (
				<div className={nav_css.navbar}>
					<h2>Digital Dialogue</h2>
					<ul>
						<li>
							<Link to="/about">ABOUT</Link>
						</li>
						<li>
							<Link to="/sign-up">CREATE AN ACCOUNT</Link>
						</li>
						<li>
							<Link to="/sign-in">LOGIN</Link>
						</li>
					</ul>
				</div>
			)}
		</>
	);
}
