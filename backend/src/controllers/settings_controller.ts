import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import Token from "../models/token";
import { deleteToken, findUser, generateUniqueToken } from "./auth_controller";
import { sendAccountVerificationEmail } from "../nodemailer_files/nodemailer";
import { User_Interface } from "../interfaces";

const autosave = async (req: Request, res: Response) => {
	// When passing user ID to database, make sure you check it's in the correct MongoDB ObjectID form!
	// Make sure to verify email format!
	// => Send a response back to the client to...
	//    - [ ] Alert the user that their email is not in the correct format and therefore hasn't been saved
	//    - [x] Alert the user that a verification email has been sent to their inbox

	const { data, type } = req.body;

	const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
	if (user_id !== undefined) {
		const user: User_Interface | undefined = await findUser(undefined, user_id);
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

					if (data) {
						await User.findByIdAndUpdate(
							{ _id: user_id },
							{
								email: data,
								verified: false
							}
						);

						const token: string = generateUniqueToken();
						const db_token = await Token.create({
							token: token,
							user_id: user._id
						});

						if (user.email !== data) {
							const status_code: number = await sendAccountVerificationEmail(
								data,
								user.first_name,
								user._id,
								token,
								db_token._id
							);
							if (status_code === 200) {
								res
									.status(200)
									.send(
										"Please check your inbox for an account verification email"
									);
								deleteToken(db_token._id);
							} else {
								res
									.status(500)
									.send(
										"There was a problem sending an email. Please check if your email is correctly formatted."
									);
							}
						}
					} else {
						res.status(500).send("There was a problem sending an email");
					}
					break;
				case 4:
					kind = "title";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							title: data || "Newbie"
						}
					);

					break;
				case 5:
					kind = "biography";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							biography: data
						}
					);

					break;
			}
		}
		res.status(200).send("Successfully saved!");
	}
};

export { autosave };
