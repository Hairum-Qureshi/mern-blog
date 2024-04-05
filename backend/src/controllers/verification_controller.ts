import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { Token_Interface, User_Interface } from "../interfaces";
import {
	sendAccountVerificationEmail,
	sendPassVerificationEmail
} from "../nodemailer_files/nodemailer";
import Token from "../models/token";
import mongoose from "mongoose";
import { findUser, generateUniqueToken, deleteToken } from "./auth_controller";

const verification = async (req: Request, res: Response) => {
	const token = req.params.token_id;
	const queryToken = req.query.token;
	const user_id = req.query.uid;
	let token_deleted = false;
	let statusMessage = "";

	if (
		mongoose.isValidObjectId(queryToken) &&
		mongoose.isValidObjectId(user_id)
	) {
		const db_token: Token_Interface | null = await Token.findOne({
			_id: queryToken,
			token
		});

		if (db_token) {
			if (db_token.token === token && db_token.user_id === user_id) {
				const mongo_uid: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
					user_id
				);
				const user: User_Interface | undefined = await findUser(
					undefined,
					mongo_uid
				);

				if (user !== undefined) {
					await User.findByIdAndUpdate({ _id: user._id }, { verified: true });
					// This needs to be here because once the verified status is updated, this can be deleted instantly; there's no point in having to still wait 5 minutes for an already verified user's token to be deleted from the DB
					await Token.deleteOne({ _id: queryToken });
					token_deleted = true;
					statusMessage =
						"Account verified! Click <a href='http://localhost:5173/sign-in'>here</a> to sign in!";
				} else {
					console.log(
						"<auth_controller.ts> [48] (not an error) - user is not defined"
					);
				}

				if (!token_deleted) deleteToken(db_token._id);
			} else {
				statusMessage = "Invalid token and user ID";
			}
		} else {
			statusMessage =
				"This token might have expired or does not exist. Click <a href='http://localhost:5173/'>here</a> to head back home";
		}
	} else {
		statusMessage = "404";
	}

	res.render("account_verification.ejs", { status: statusMessage });
};

const passwordReset = async (req: Request, res: Response) => {
	// Send an email to the user to basically verify that they were the one to have requested a password reset email
	// This will add a layer of security to prevent users from just guessing people's emails and changing their passwords

	// TODO - resolve error: when the user enters a new password that's the same as their old one, there's a 'cannot send headers after they are sent to the client' error despite there being a check to see if the "new" password is the same as the old one

	const { email, duplicatePassword: new_password } = req.body;

	const user: User_Interface | undefined = await findUser(email);
	if (user !== undefined) {
		const uniqueToken: string = generateUniqueToken();

		const hashedPassword = await bcrypt.hash(new_password, 10);
		if (!user.password) {
			res
				.status(500)
				.send(
					"This account is tied to a Google account. Consider logging in through Google"
				);
		} else {
			const match = await bcrypt.compare(new_password, user.password);
			if (match) {
				res
					.send(409)
					.send(
						"Consider entering a new password that's different from your current one"
					);
			} else {
				if (!user.verified) {
					const token = await Token.create({
						token: generateUniqueToken(),
						user_id: user._id
					});

					const status: number = await sendAccountVerificationEmail(
						user.email,
						user.first_name,
						user._id,
						token.token,
						token._id
					);

					if (status === 200) {
						res
							.status(200)
							.send(
								"Your account does not appear to be verified. Please check your inbox for a new account verification email"
							);
					} else {
						console.log("<auth_controller.ts> [116] ERROR sending email");
						res.status(500).send("There was an issue sending an email");
					}
				} else {
					const token = await Token.create({
						token: uniqueToken,
						user_id: user._id,
						new_password: hashedPassword
					});
					const status: number = await sendPassVerificationEmail(
						user.first_name,
						email,
						user._id,
						uniqueToken,
						token._id
					);
					if (status === 200) {
						res
							.status(200)
							.send(
								"Please check your inbox for a password reset verification email"
							);

						deleteToken(token._id);
					} else {
						console.log(
							"<auth_controller.ts> [142] ERROR - there was an issue sending the user an email"
						);
						res.status(500).send("There was a problem sending an email");
					}
				}
			}
		}
	} else {
		res.status(404).send("No user exists with this email");
	}
};

const verifyNewPassword = async (req: Request, res: Response) => {
	const token_id = req.params.token_id;

	if (!mongoose.isValidObjectId(token_id)) {
		return res.render("404.html");
	}

	const token_data = await Token.findOne({ _id: token_id });
	if (!token_data) {
		return res.render("newPassword_verification.ejs", {
			message: "This token is either invalid or has expired"
		});
	}

	let mongo_ID_Format: mongoose.Types.ObjectId;
	try {
		mongo_ID_Format = new mongoose.Types.ObjectId(token_data.user_id);
	} catch (error) {
		return res.render("newPassword_verification.ejs", {
			message: "Error processing token data"
		});
	}

	const user: User_Interface | undefined = await findUser(
		undefined,
		mongo_ID_Format
	);
	if (!user) {
		await deleteToken(mongo_ID_Format);
		return res.render("newPassword_verification.ejs", {
			message: "There doesn't appear to be a user with this ID"
		});
	}

	try {
		await User.findByIdAndUpdate(
			{ _id: user._id },
			{ password: token_data.new_password }
		);

		await Token.deleteOne({ _id: token_id });

		return res.render("newPassword_verification.ejs", {
			message:
				"Password successfully updated! Click <a href = 'http://localhost:5173/sign-in'>here</a> to sign into your account with your new password!"
		});
	} catch (error) {
		console.log("<auth_controller.ts> [201] - Error updating password:", error);
		return res.render("newPassword_verification.ejs", {
			message: "Error updating password"
		});
	}
};

export { verification, passwordReset, verifyNewPassword };
