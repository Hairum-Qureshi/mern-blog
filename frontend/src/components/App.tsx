import "../css/app.css";
import Navbar from "./Navbar";
import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import Home from "./Home";

function App() {
	return (
		<BrowserRouter>
			{/* <AuthProvider> */}
			<Navbar />
			<Routes>
				{/* Maybe add a profile page */}
				{/* <Route path="/" element={<Landing />} /> */}
				{/* <Route path="/sign-up" element={<SignUp />} />
					<Route path="/sign-in" element={<SignIn />} /> */}

				{/* <Route path="*" element={<NotFound />} /> */}
			</Routes>
			{/* </AuthProvider> */}
		</BrowserRouter>
	);
}

export default App;
