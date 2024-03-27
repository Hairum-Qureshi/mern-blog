import { Link, useLocation } from "react-router-dom";
import auth_page_css from "../css/authpage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import useAuth from "../hooks/useAuth";

export default function UserAuthentication() {
	const url_params = ["/sign-in", "/sign-up", "/forgot-password"];
	const current_path = useLocation().pathname;
	const { loginWithGoogle, userData } = useAuth();

	console.log(userData);

	return current_path == url_params[0] ? (
		<>
			<div className={auth_page_css.mainContainer}>
				<div className={auth_page_css.left}></div>
				<div className={auth_page_css.right}>
					<div className={auth_page_css.form}>
						<h2>LOGIN</h2> <br />
						<div className={auth_page_css.googleContainer}>
							<button onClick={() => loginWithGoogle()}>
								<span>
									<FontAwesomeIcon icon={faGoogle} />
								</span>
								<span>LOGIN WITH GOOGLE</span>
							</button>
						</div>
						<div className={auth_page_css.separator}>OR</div>
						<span>
							Don't have an account? <Link to="/sign-up">Create one!</Link>
							<br />
							<br />
							<Link to="/forgot-password">Forgot Password?</Link>
						</span>
						<label htmlFor="Email" style={{ marginBottom: "5px" }}>
							Email
						</label>
						<input type="email" placeholder="Email" name="Email" />
						<label htmlFor="Password">Password</label>
						<input type="password" placeholder="Password" name="Password" />
						<button className={auth_page_css.authButton}>LOGIN</button>
					</div>
				</div>
			</div>
		</>
	) : current_path === url_params[1] ? (
		<div className={auth_page_css.mainContainer}>
			<div className={auth_page_css.left}></div>
			<div className={auth_page_css.right}>
				<div className={auth_page_css.form}>
					<h2>CREATE AN ACCOUNT</h2> <br />
					<div className={auth_page_css.googleContainer}>
						<button onClick={() => loginWithGoogle()}>
							<span>
								<FontAwesomeIcon icon={faGoogle} />
							</span>
							<span>CONTINUE WITH GOOGLE</span>
						</button>
					</div>
					<div className={auth_page_css.separator}>OR</div>
					<span>
						Already have an account? <Link to="/sign-in">Sign in!</Link>
					</span>
					<label htmlFor="First Name">First Name</label> <br />
					<input type="text" placeholder="First Name" name="First Name" />
					<label htmlFor="First Name">Last Name</label>
					<input type="text" placeholder="Last Name" name="Last Name" />
					<label htmlFor="Email">Email</label>
					<input type="email" placeholder="Email" name="Email" />
					<label htmlFor="Password">Password</label>
					<input type="password" placeholder="Password" name="Password" />
					<button className={auth_page_css.authButton}>JOIN</button>
				</div>
			</div>
		</div>
	) : (
		<>
			<div className={auth_page_css.mainContainer}>
				<div className={auth_page_css.left}></div>
				<div className={auth_page_css.right}>
					<div className={auth_page_css.form}>
						<h2>PASSWORD RESET</h2> <br />
						<span>
							Already have an account? <Link to="/sign-in">Sign in!</Link>
							<br /> <br />
							Don't have an account? <Link to="/sign-up">Create one!</Link>
						</span>
						<label htmlFor="Email" style={{ marginBottom: "5px" }}>
							Email
						</label>
						<input type="email" placeholder="Email" name="Email" />
						<button className={auth_page_css.authButton}>SEND EMAIL</button>
					</div>
				</div>
			</div>
		</>
	);
}
