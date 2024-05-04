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
import Form from "./blogs/Form";
import About from "./About";
import Blog from "./blogs/Blog";
import Footer from "./Footer";

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
						<Route path="/user/:user_id/blog/create" element={<Form />} />
						<Route path="/about" element={<About />} />
						<Route path="/blogs/:blog_id/:blog_name" element={<Blog />} />
						<Route path="/blogs/:blog_id/:blog_name/edit" element={<Form />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
					<Footer />
				</GoogleOAuthProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
