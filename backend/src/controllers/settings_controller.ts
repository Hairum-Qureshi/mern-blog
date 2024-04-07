import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import { findUser } from "./auth_controller";
import user from "../models/user";

const autosave = async (req: Request, res: Response) => {
	// const { firstName, lastName, email } = req.body;
	const { data, type } = req.body;

	const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
	if (user_id !== undefined) {
		const user = await findUser(undefined, user_id);
		let kind: string;

		if (user) {
			switch (type) {
				case 1:
					kind = "first_name";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							first_name: data,
							full_name: `${data} ${user.last_name}`
						}
					);
					break;
				case 2:
					kind = "last_name";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							last_name: data,
							full_name: `${user.first_name} ${data}`
						}
					);
					break;
				case 3:
					kind = "email";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							email: data
						}
					);
					break;
			}
		}
		res.status(200).send("GOOD");
	}

	// if (user_id !== undefined) {
	// 	// When passing user ID to database, make sure you check it's in the correct MongoDB ObjectID form!
	// const user = await findUser(undefined, user_id);
	// 	if (user) {
	// const res = await User.findByIdAndUpdate(
	// 	{ _id: user_id },
	// 	{
	// 		first_name: firstName || user.first_name,
	// 		last_name: lastName || user.last_name,
	// 		full_name: `${firstName || user.first_name} ${
	// 			lastName || user.last_name
	// 		}`,
	// 		email: email || user.email
	// 	}
	// );
	// 	}

	// res.status(200).send("GOOD");
	// } else {
	// 	res.status(500).send("BAD");
	// }
};

export { autosave };
