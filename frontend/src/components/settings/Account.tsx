import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import settings_css from "./../../css/settings.module.css";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";
import { useEffect, useRef, useState } from "react";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";
import { useSettings } from "../../hooks/useSettings";
import toast, { Toaster } from "react-hot-toast";

// TODO - need to make the bio word count (character count?) work

// TODO - disabled code to update email data

export default function Account() {
	const { userData } = useAuthContext()!;
	const [profileImage, setProfileImage] = useState(null);
	const [backdropImage, setBackdropImage] = useState(null);
	const inputRef_pfp = useRef<HTMLInputElement>(null);
	const inputRef_backdrop = useRef<HTMLInputElement>(null);

	const { autoSave, saving, showSavingStatus, data, message } = useSettings();

	const [firstName, setFirstName] = useState<string | null>("");
	const [lastName, setLastName] = useState<string | null>("");
	const [email, setEmail] = useState<string | null>("");
	const [biography, setBiography] = useState<string | null>(
		userData && userData.biography
	);

	useEffect(() => {
		if (data && userData) {
			setFirstName(data.first_name);
			setLastName(data.last_name);
			setEmail(data.email);
		}
	}, [data]);

	function handlePfpImageUpload() {
		if (inputRef_pfp.current) inputRef_pfp.current.click();
	}

	function handleBackdropImageUpload() {
		if (inputRef_backdrop.current) inputRef_backdrop.current.click();
	}

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (email) {
				autoSave(3, email);
				if (message) {
					toast(message, {
						icon: "📧",
						style: {
							borderRadius: "10px",
							background: "#076315",
							color: "#fff"
						}
					});
				}
			}
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [email]);

	return userData ? (
		<>
			<Toaster />
			<div className={settings_css.settingsContainer}>
				<div className={settings_css.header}>
					<h3>MANAGE ACCOUNT DATA</h3>
					{saving ? (
						<span>Saving...</span>
					) : (
						<span>
							Saved <FontAwesomeIcon icon={faCircleCheck} />
						</span>
					)}
					{/* <span className={settings_css.error}>
						<FontAwesomeIcon icon={faCircleXmark} /> Error
					</span> */}
				</div>
				<div className={settings_css.section}>
					<input
						type="text"
						placeholder="First Name"
						value={firstName!}
						onChange={e => {
							setFirstName(e.target.value);
							showSavingStatus();
						}}
						onBlur={() => autoSave(1, firstName!)}
					/>
				</div>
				<div className={settings_css.section}>
					<input
						type="text"
						placeholder="Last Name"
						value={lastName!}
						onChange={e => {
							setLastName(e.target.value);
						}}
						onBlur={() => autoSave(2, lastName!)}
					/>
				</div>
				<div className={settings_css.section}>
					<input
						type="email"
						placeholder="Email"
						value={email!}
						onChange={e => {
							setEmail(e.target.value);
						}}
					/>
				</div>
				<div className={settings_css.header}>
					<h3>PRIVACY</h3>
				</div>
				<div className={settings_css.section}>
					Would you like your email public?
					<label for="Yes">
						<input type="radio" name="choice" />
						Yes
					</label>
					<label for="No">
						<input type="radio" name="choice" />
						No
					</label>
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
					{/* NEED TO HAVE A SEPARATE ONE FOR TEXTAREA */}
					{/* {saving ? (
						<span>Saving...</span>
					) : (
						<span>
							Saved <FontAwesomeIcon icon={faCircleCheck} />
						</span>
					)} */}
					{/* <span className={settings_css.error}>
						<FontAwesomeIcon icon={faCircleXmark} /> Error
					</span> */}
				</div>
				<div className={settings_css.section}>
					<textarea
						placeholder="Begin typing..."
						value={biography!}
						onChange={e => {
							setBiography(e.target.value);
							showSavingStatus();
						}}
						// onBlur={()}
					></textarea>
				</div>
				<div className={settings_css.section}>
					<small>{biography!.length}/2000 Words</small>
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
