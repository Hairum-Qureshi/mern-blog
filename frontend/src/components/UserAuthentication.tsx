import { Link, useLocation } from "react-router-dom";
import auth_page_css from "../css/authpage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function UserAuthentication() {
	const url_params = ["/sign-in", "/sign-up", "/forgot-password"];
	const current_path = useLocation().pathname;

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { loginWithGoogle, login, createAccount, sendEmail, errorHandler } =
		useAuth();

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
						<br />
						<br />
						<span style={{ color: "red" }}>
							{errorHandler && errorHandler.message ? errorHandler.message : ""}
						</span>
						<label htmlFor="Email" style={{ marginBottom: "5px" }}>
							Email
						</label>
						<input
							type="email"
							placeholder="Email"
							name="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							style={{ border: errorHandler.noEmail ? "1px solid red" : "" }}
						/>
						<label htmlFor="Password">Password</label>
						<input
							type="password"
							placeholder="Password"
							name="Password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							style={{
								border: errorHandler.noPassword ? "1px solid red" : ""
							}}
						/>
						<button
							className={auth_page_css.authButton}
							onClick={() => login(email, password)}
						>
							LOGIN
						</button>
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
					<br />
					<br />
					<span style={{ color: "red" }}>
						{errorHandler && errorHandler.message ? errorHandler.message : ""}
					</span>
					<label htmlFor="First Name">First Name</label> <br />
					<input
						type="text"
						placeholder="First Name"
						name="First Name"
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
						style={{ border: errorHandler.noFirstName ? "1px solid red" : "" }}
					/>
					<label htmlFor="First Name">Last Name</label>
					<input
						type="text"
						placeholder="Last Name"
						name="Last Name"
						value={lastName}
						onChange={e => setLastName(e.target.value)}
						style={{ border: errorHandler.noLastName ? "1px solid red" : "" }}
					/>
					<label htmlFor="Email">Email</label>
					<input
						type="email"
						placeholder="Email"
						name="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						style={{ border: errorHandler.noEmail ? "1px solid red" : "" }}
					/>
					<label htmlFor="Password">Password</label>
					<input
						type="password"
						placeholder="Password"
						name="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						style={{ border: errorHandler.noPassword ? "1px solid red" : "" }}
					/>
					<button
						className={auth_page_css.authButton}
						onClick={() => createAccount(firstName, lastName, email, password)}
					>
						JOIN
					</button>
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
						<br />
						<br />
						<span style={{ color: "red" }}>
							{errorHandler && errorHandler.message ? errorHandler.message : ""}
						</span>
						<label htmlFor="Email" style={{ marginBottom: "5px" }}>
							Email
						</label>
						<input
							type="email"
							placeholder="Email"
							name="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							style={{ border: errorHandler.noEmail ? "1px solid red" : "" }}
						/>
						<button
							className={auth_page_css.authButton}
							onClick={() => sendEmail(email)}
						>
							SEND EMAIL
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
