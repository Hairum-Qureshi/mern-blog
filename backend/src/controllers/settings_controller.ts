import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import Token from "../models/token";
import { deleteToken, findUser, generateUniqueToken } from "./auth_controller";
import { sendAccountVerificationEmail } from "../nodemailer_files/nodemailer";
import { User_Interface } from "../interfaces";

const autosave = async (req: Request, res: Response) => {
	// TODO - When passing user ID to database, make sure you check it's in the correct MongoDB ObjectID form!
	// TODO - Make sure to verify email format!

	const { data, type } = req.body;

	const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
	if (user_id !== undefined) {
		const user: User_Interface | undefined = await findUser(undefined, user_id);
		// let kind: string;

		if (user !== undefined) {
			switch (type) {
				case 1:
					// kind = "first_name";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							first_name: data,
							full_name: `${data} ${user.last_name}`
						}
					);
					break;
				case 2:
					// kind = "last_name";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							last_name: data,
							full_name: `${user.first_name} ${data}`
						}
					);
					break;
				case 3:
					// kind = "email";
					if (data) {
						const token: string = generateUniqueToken();
						const db_token = await Token.create({
							token: token,
							user_id: user._id
						});

						if (user.email !== data) {
							await User.findByIdAndUpdate(
								{ _id: user_id },
								{
									email: data,
									verified: false
								}
							);
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
										"Please check your inbox for an account verification email. You will need to re-verify your account and sign in again."
									);
								req.session.destroy(error => {
									if (error) {
										console.error("<settings_controller.ts> [78] ERROR", error);
										res.status(500).send("Error destroying session");
									} else {
										res.clearCookie("auth-session");
										res.status(200).send("Success");
									}
								});

								deleteToken(db_token._id);
							} else {
								res
									.status(500)
									.send(
										"There was a problem sending an email. Please check if your email is correctly formatted or if you're not using a different email"
									);
							}
							return;
						} else {
							res.status(200).send("Email already exists");
							return;
						}
					} else {
						res.status(500).send("Try using a different email");
						return;
					}
					break;
				case 4:
					// kind = "title";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							title: data || "Newbie"
						}
					);
					break;
				case 5:
					// kind = "biography";
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							biography: data
						}
					);
					break;
			}
			res.status(200).send("Saved successfully!");
		}
	}
};

const autosaveSocialMedia = async (req: Request, res: Response) => {
	// TODO - When passing user ID to database, make sure you check it's in the correct MongoDB ObjectID form!
	const { data, type } = req.body;

	const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
	if (user_id !== undefined) {
		const user: User_Interface | undefined = await findUser(undefined, user_id);

		if (user !== undefined) {
			const twitter_x: string = user.social_media.twitter_x;
			const instagram: string = user.social_media.instagram;
			const facebook: string = user.social_media.facebook;
			const pinterest: string = user.social_media.pinterest;
			const discord: string = user.social_media.discord;

			switch (type) {
				case 1:
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							$set: {
								"social_media.twitter_x": data || "",
								"social_media.instagram": instagram,
								"social_media.facebook": facebook,
								"social_media.pinterest": pinterest,
								"social_media.discord": discord
							}
						}
					);
					break;
				case 2:
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							$set: {
								"social_media.twitter_x": twitter_x,
								"social_media.instagram": data ? data.toLowerCase() : "",
								"social_media.facebook": facebook,
								"social_media.pinterest": pinterest,
								"social_media.discord": discord
							}
						}
					);
					break;
				case 3:
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							$set: {
								"social_media.twitter_x": twitter_x,
								"social_media.instagram": instagram,
								"social_media.facebook": data || "",
								"social_media.pinterest": pinterest,
								"social_media.discord": discord
							}
						}
					);
					break;
				case 4:
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							$set: {
								"social_media.twitter_x": twitter_x,
								"social_media.instagram": instagram,
								"social_media.facebook": facebook,
								"social_media.pinterest": data || "",
								"social_media.discord": discord
							}
						}
					);
					break;
				case 5:
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{
							$set: {
								"social_media.twitter_x": twitter_x,
								"social_media.instagram": instagram,
								"social_media.facebook": facebook,
								"social_media.pinterest": pinterest,
								"social_media.discord": data ? data.toLowerCase() : ""
							}
						}
					);
					break;
			}
			res.status(200).send("Saved successfully!");
		}
	}
};

export { autosave, autosaveSocialMedia };

// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import User from "../models/user";
// import Token from "../models/token";
// import { deleteToken, findUser, generateUniqueToken } from "./auth_controller";
// import { sendAccountVerificationEmail } from "../nodemailer_files/nodemailer";
// import { User_Interface } from "../interfaces";

// const autosave = async (req: Request, res: Response) => {
// 	// TODO - When passing user ID to database, make sure you check it's in the correct MongoDB ObjectID form!
// 	// TODO - Make sure to verify email format!

// 	const { data, type } = req.body;

// 	const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
// 	if (user_id !== undefined) {
// 		const user: User_Interface | undefined = await findUser(undefined, user_id);
// 		let kind: string;

// 		if (user !== undefined) {
// 			switch (type) {
// 				case 1:
// 					kind = "first_name";
// 					await User.findByIdAndUpdate(
// 						{ _id: user_id },
// 						{
// 							first_name: data,
// 							full_name: `${data} ${user.last_name}`
// 						}
// 					);
// 					break;
// 				case 2:
// 					kind = "last_name";
// 					await User.findByIdAndUpdate(
// 						{ _id: user_id },
// 						{
// 							last_name: data,
// 							full_name: `${user.first_name} ${data}`
// 						}
// 					);
// 					break;
// 				case 3:
// 					kind = "email";
// 					if (data) {
// 						const token: string = generateUniqueToken();
// 						const db_token = await Token.create({
// 							token: token,
// 							user_id: user._id
// 						});

// 						if (user.email !== data) {
// 							await User.findByIdAndUpdate(
// 								{ _id: user_id },
// 								{
// 									email: data,
// 									verified: false
// 								}
// 							);
// 							const status_code: number = await sendAccountVerificationEmail(
// 								data,
// 								user.first_name,
// 								user._id,
// 								token,
// 								db_token._id
// 							);
// 							if (status_code === 200) {
// 								res
// 									.status(200)
// 									.send(
// 										"Please check your inbox for an account verification email. You will need to re-verify your account and sign in again."
// 									);
// 								req.session.destroy(error => {
// 									if (error) {
// 										console.error("<settings_controller.ts> [78] ERROR", error);
// 										res.status(500).send("Error destroying session");
// 									} else {
// 										res.clearCookie("auth-session");
// 										res.status(200).send("Success");
// 									}
// 								});

// 								deleteToken(db_token._id);
// 							} else {
// 								res
// 									.status(500)
// 									.send(
// 										"There was a problem sending an email. Please check if your email is correctly formatted or if you're not using a different email"
// 									);
// 							}
// 							// return;
// 						} else {
// 							res.status(200).send("Email already exists");
// 							// return;
// 						}
// 					} else {
// 						res.status(500).send("Try using a different email");
// 						// return;
// 					}
// 					break;
// 				case 4:
// 					kind = "title";
// 					await User.findByIdAndUpdate(
// 						{ _id: user_id },
// 						{
// 							title: data || "Newbie"
// 						}
// 					);
// 					break;
// 				case 5:
// 					kind = "biography";
// 					await User.findByIdAndUpdate(
// 						{ _id: user_id },
// 						{
// 							biography: data
// 						}
// 					);
// 					break;
// 			}
// 			res.status(200).send("Saved successfully!");
// 		}
// 	}
// };

// const autosaveSocialMedia = async (req: Request, res: Response) => {
// 	// TODO - When passing user ID to database, make sure you check it's in the correct MongoDB ObjectID form!
// 	const { data, type } = req.body;

// 	const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
// 	if (user_id !== undefined) {
// 		const user: User_Interface | undefined = await findUser(undefined, user_id);
// 		let kind: string;
// 		if(user !== undefined) {
// 			switch(type) {

// 			}
// 		}
// 	}
// };

// export { autosave, autosaveSocialMedia };
