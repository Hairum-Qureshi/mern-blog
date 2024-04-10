import axios from "axios";
import { User, useSettingsTypes } from "../interfaces";
import { useEffect, useState } from "react";
import useAuthContext from "../contexts/authContext";

export function useSettings(): useSettingsTypes {
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string>("");

	const REGEX: RegExp =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	async function autoSave(
		input_id: number,
		firstName?: string,
		lastName?: string,
		email?: string
	) {
		if (firstName || lastName || email) {
			setSaving(true);

			try {
				const response = await axios.post(
					"http://localhost:4000/api/user/settings/autosave",
					{
						data: firstName || lastName || email,
						type: input_id
					},
					{ withCredentials: true }
				);
				setMessage(response.data);
			} catch (error) {
				console.log(error);
				// TODO - Figure out how to display the error message form the server here:
				setMessage(
					"There was a problem sending an email. Please check your email format"
				);
				// setMessage(error.response.data);
			} finally {
				setSaving(false);
			}
		}
	}

	function deleteAccount() {
		const confirmation = confirm(
			"Are you sure you would like to delete your account?"
		);
		if (confirmation) {
			axios.delete(`http://localhost:4000/api/user/deleteAccount`, {
				withCredentials: true
			});

			window.location.href = "http://localhost:5173/";
		}
	}

	function showSavingStatus() {
		setSaving(true);
	}

	const [data, setData] = useState<User | null>(null);
	useEffect(() => {
		async function getCurrentUpdatedData() {
			try {
				const userDataResponse = await axios.get(
					"http://localhost:4000/api/user/current/logged-in",
					{
						withCredentials: true
					}
				);
				if (userDataResponse.data.message === "user is not logged in") {
					setData(null);
				} else {
					setData(userDataResponse.data);
				}
			} catch (error) {
				console.error("There was an error", error);
			}
		}

		getCurrentUpdatedData();
	}, []);

	async function uploadImage(imageFile: File) {
		const formData = new FormData();
		formData.append("file", imageFile);

		try {
			const response = await axios.post(
				"http://localhost:4000/api/user/settings/upload",
				formData,
				{
					withCredentials: true
				}
			);

			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	return {
		autoSave,
		saving,
		showSavingStatus,
		data,
		message,
		deleteAccount,
		uploading,
		uploadImage
	};
}
