import "../css/app.css";
import Navbar from "./Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./Landing";
import UserAuthentication from "./UserAuthentication";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NotFound from "./NotFound";
import Profile from "./Profile";
import Settings from "./Settings";
import { AuthProvider } from "../contexts/authContext";
import PostBlog from "./blogs/PostBlog";
import About from "./About";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<GoogleOAuthProvider clientId="383135081883-hmftoems5j76sihs3mbtu208pbqgkons.apps.googleusercontent.com">
					<Navbar />
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/sign-up" element={<UserAuthentication />} />
						<Route path="/sign-in" element={<UserAuthentication />} />
						<Route path="/forgot-password" element={<UserAuthentication />} />
						<Route path="/user/:user_id/profile" element={<Profile />} />
						<Route
							path="/user/:user_id/profile/settings"
							element={<Settings />}
						/>
						<Route
							path="/user/:user_id/blog/create-blog"
							element={<PostBlog />}
						/>
						<Route path="/about" element={<About />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</GoogleOAuthProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
