import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import settings_css from "./../../css/settings.module.css";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import useAuthContext from "../../contexts/authContext";
import NotFound from "../NotFound";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";
import { useSettings } from "../../hooks/useSettings";
import toast, { Toaster } from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

// TODO - need to make the bio word count (character count?) work
// TODO - need to add middleware (?) to prevent other users to have access to the settings page if it's not their account
// TODO - use the `faCircleXmark` icon to be displayed when there's an error saving
// TODO - set the file inputs to ONLY accept images

export default function Account() {
	const { userData, signOut } = useAuthContext()!;
	const [profileImage, setProfileImage] = useState(null);
	const [backdropImage, setBackdropImage] = useState(null);
	const inputRef_pfp = useRef<HTMLInputElement>(null);
	const inputRef_backdrop = useRef<HTMLInputElement>(null);

	const {
		autoSave,
		saving,
		showSavingStatus,
		data,
		message,
		deleteAccount,
		uploading,
		uploadImage
	} = useSettings();

	const [firstName, setFirstName] = useState<string | null>("");
	const [lastName, setLastName] = useState<string | null>("");
	const [email, setEmail] = useState<string | null>("");
	const [biography, setBiography] = useState<string | null>("");
	const [title, setTitle] = useState<string | null>("");
	const [showEmail, setShowEmail] = useState<boolean>(false);

	useEffect(() => {
		if (data && userData) {
			setFirstName(data.first_name); // 1
			setLastName(data.last_name); // 2
			setEmail(data.email); // 3
			setTitle(data.title); // 4
			setBiography(data.biography); // 5
			setShowEmail(data.show_email);
		}
	}, [data]);

	function handlePfpImageUpload() {
		if (inputRef_pfp.current) inputRef_pfp.current.click();
	}

	function handlePfpImageChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files) {
			const file = event.target.files[0];
			uploadImage(file, "pfp");
		}
	}

	function handleBackdropImageUpload() {
		if (inputRef_backdrop.current) inputRef_backdrop.current.click();
	}

	function handleBackdropImageChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files) {
			const file = event.target.files[0];
			uploadImage(file, "backdrop");
		}
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

					setTimeout(() => {
						if (
							message !==
								"There was a problem sending an email. Please check if your email is correctly formatted or if you're not using a different email" &&
							message !== "Email already exists"
						) {
							signOut();
						}
					}, 3000);
				}
			}
		}, 500);
		return () => clearTimeout(delayDebounceFn);
	}, [email]);

	return userData && userData.message !== "user does not exist" ? (
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
				{userData.isGoogleAccount ? (
					<div className={settings_css.section}>
						<p>
							<b>NOTE:</b> because you signed up through Google, you are unable
							to change your email
						</p>
					</div>
				) : null}
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
							showSavingStatus();
						}}
						onBlur={() => autoSave(2, lastName!)}
					/>
				</div>
				<div className={settings_css.section}>
					<input
						type="email"
						placeholder="Email"
						value={email!}
						disabled={userData.isGoogleAccount}
						onChange={e => {
							setEmail(e.target.value);
						}}
					/>
				</div>
				<div className={settings_css.section}>
					<input
						type="text"
						placeholder="What kind of writer are you?"
						value={title!}
						onChange={e => {
							setTitle(e.target.value);
							showSavingStatus();
						}}
						onBlur={() => autoSave(4, title!)}
					/>
				</div>
				<div className={settings_css.header}>
					<h3>PRIVACY</h3>
				</div>
				<div className={settings_css.section}>
					Would you like your email public? (Currently, you have it set to
					{data?.show_email.toString() === "false" ? " No" : " Yes"})
					<label for="Yes">
						<input
							type="radio"
							name="choice"
							onChange={() => setShowEmail(true)}
						/>
						Yes
					</label>
					<label for="No">
						<input
							type="radio"
							name="choice"
							onChange={() => setShowEmail(false)}
						/>
						No
					</label>
				</div>
				<div className={settings_css.header}>
					<h3>IMAGES</h3>
					{uploading ? (
						<span>Updating image...</span>
					) : (
						<span>
							Uploaded <FontAwesomeIcon icon={faCircleCheck} />
						</span>
					)}
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
								onChange={handlePfpImageChange}
							/>

							<img src={data?.profile_picture} alt="User profile picture" />
						</div>
						<div
							className={settings_css.backdrop}
							onClick={handleBackdropImageUpload}
						>
							<input
								type="file"
								style={{ display: "none" }}
								ref={inputRef_backdrop}
								onChange={handleBackdropImageChange}
							/>
							<img src={data?.backdrop} alt="User profile backdrop" />
						</div>
					</div>
				</div>
				<div className={settings_css.header}>
					<h3>BIOGRAPHY</h3>
					{/* NEED TO HAVE A SEPARATE ONE FOR TEXTAREA */}
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
				<div className={settings_css.section2}>
					<MDEditor
						value={biography!}
						onChange={(value: string) => {
							setBiography(value);
							showSavingStatus();
						}}
						onBlur={() => autoSave(5, biography!)}
						previewOptions={{
							rehypePlugins: [[rehypeSanitize]]
						}}
						textareaProps={{
							placeholder: `Tell the world about yourself, ${data?.first_name}`,
							maxLength: 1000
						}}
					/>
				</div>
				<div className={settings_css.section}>
					<small>{biography && biography.length}/1000 Words</small>
				</div>
				<div className={settings_css.headerDanger}>
					<h3>⚠️ DANGER ZONE ⚠️</h3>
				</div>
				<div className={settings_css.section}>
					<button className={settings_css.deleteAccBtn} onClick={deleteAccount}>
						DELETE ACCOUNT
					</button>
				</div>
			</div>
		</>
	) : (
		<NotFound />
	);
}
