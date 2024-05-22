import express from "express";
import mongoose from "mongoose";
import User from "../models/user";
import { User_Interface } from "../interfaces";

const router = express.Router();

async function updateRecord(
	curr_uid: mongoose.Types.ObjectId,
	user_id: string,
	user: User_Interface,
	isAppending: boolean
): Promise<number> {
	let status = 200;
	if (isAppending) {
		try {
			await User.findByIdAndUpdate(
				{ _id: curr_uid },
				{
					$push: { postNotifEnabledAccounts: user_id }
				}
			);

			await User.findByIdAndUpdate(
				{ _id: user_id },
				{
					$push: { postNotifSubscriber_emails: user.email }
				}
			);
		} catch (error) {
			console.log("<user_routes.ts>[31] ERROR", error);
			status = 500;
		}
	} else {
		try {
			await User.findByIdAndUpdate(
				{ _id: curr_uid },
				{
					$pull: { postNotifEnabledAccounts: user_id }
				}
			);
			await User.findByIdAndUpdate(
				{ _id: user_id },
				{
					$pull: { postNotifSubscriber_emails: user.email }
				}
			);
		} catch (error) {
			console.log("<user_routes.ts>[49] ERROR", error);
			status = 500;
		}
	}

	return status;
}

/* Prefix: /api/user */

router.patch("/handle-post-notifications", async (req, res) => {
	const { user_id, enableNotifications } = req.body;
	const curr_uid: mongoose.Types.ObjectId | undefined = req.session.user_id;
	const user: User_Interface | null = await User.findById({ _id: curr_uid });
	let status = 200;

	// When a user deletes their account, their email is still saved which needs to be

	if (curr_uid !== undefined && user) {
		if (enableNotifications) {
			status = await updateRecord(curr_uid, user_id, user, true);
		} else {
			status = await updateRecord(curr_uid, user_id, user, false);
		}
	}

	if (status === 200) {
		res.status(200).send("Success");
	} else {
		res.status(500).send("There was a problem");
	}
});

export default router;
