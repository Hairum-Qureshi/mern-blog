import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import settings_css from "./../../css/settings.module.css";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";
import { useRef, useState } from "react";

export default function Account() {
	const { userData } = useAuthContext()!;
	const [profileImage, setProfileImage] = useState(null);
	const [backdropImage, setBackdropImage] = useState(null);
	const inputRef_pfp = useRef<HTMLInputElement>(null);
	const inputRef_backdrop = useRef<HTMLInputElement>(null);

	function handlePfpImageUpload() {
		if (inputRef_pfp.current) inputRef_pfp.current.click();
	}

	function handleBackdropImageUpload() {
		if (inputRef_backdrop.current) inputRef_backdrop.current.click();
	}

	return userData ? (
		<>
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>MANAGE ACCOUNT DATA</h3>
				</div>
				<div className={settings_css.section}>
					<input
						type="text"
						placeholder="First Name"
						value={userData.first_name}
					/>
				</div>
				<div className={settings_css.section}>
					<input
						type="text"
						placeholder="Last Name"
						value={userData.last_name}
					/>
				</div>
				<div className={settings_css.section}>
					<input type="email" placeholder="Email" value={userData.email} />
				</div>
				<div className={settings_css.header}>
					<h3>IMAGES</h3>
				</div>
				<div className={settings_css.section2}>
					<div className={settings_css.imagesContainer}>
						<div
							className={settings_css.profilePicture}
							onClick={handlePfpImageUpload}
						>
							<input
								type="file"
								style={{ display: "none" }}
								ref={inputRef_pfp}
							/>

							<img src={userData.profile_picture} alt="User profile picture" />
						</div>
						<div
							className={settings_css.backdrop}
							onClick={handleBackdropImageUpload}
						>
							<input
								type="file"
								style={{ display: "none" }}
								ref={inputRef_backdrop}
							/>
							<img src={userData.backdrop} alt="User profile backdrop" />
						</div>
					</div>
				</div>
				<div className={settings_css.header}>
					<h3>BIOGRAPHY</h3>
				</div>
				<div className={settings_css.section}>
					<textarea
						placeholder="Begin typing..."
						value={userData.biography}
					></textarea>
				</div>
				<div className={settings_css.headerDanger}>
					<h3>DANGER ZONE</h3>
				</div>
				<div className={settings_css.section}>
					<button>DELETE ACCOUNT</button>
				</div>
			</div>
		</>
	) : (
		<NotFound />
	);
}
