import { Link } from "react-router-dom";
import nav_css from "../css/navbar.module.css";

export default function Navbar() {
	return (
		<div className={nav_css.navbar}>
			<h2>Digital Dialogue</h2>
			<ul>
				<li>
					<Link to="/">ABOUT</Link>
				</li>
				<li>
					<Link to="/">CREATE AN ACCOUNT</Link>
				</li>
				<li>
					<Link to="/">LOGIN</Link>
				</li>
			</ul>
		</div>
	);
}
