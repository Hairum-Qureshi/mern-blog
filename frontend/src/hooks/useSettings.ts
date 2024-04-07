import axios from "axios";
import { ErrorHandler, User, useSettingsTypes } from "../interfaces";
import { useEffect, useState } from "react";

export function useSettings(): useSettingsTypes {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [errorHandler, setErrorHandler] = useState<ErrorHandler>({
		noFirstName: false,
		noLastName: false,
		noEmail: false,
		noBiography: false
	});
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
				await axios.post(
					"http://localhost:4000/api/user/settings/autosave",
					{
						data: firstName || lastName || email,
						type: input_id
					},
					{ withCredentials: true }
				);
			} catch (error) {
				console.log(error);
			} finally {
				setSaving(false);
			}
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

	return { autoSave, saving, error, showSavingStatus, errorHandler, data };
}
