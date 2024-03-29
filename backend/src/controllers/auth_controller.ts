import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { Token_Interface, User_Interface } from "../interfaces";
import {
	sendAccountVerificationEmail,
	sendPassVerificationEmail
} from "../nodemailer_files/nodemailer";
import jwt from "jsonwebtoken";
import Token from "../models/token";
import mongoose from "mongoose";

// TODO - move all similar/repeated code to new functions!

async function findUser(
	email?: string,
	user_id?: mongoose.Types.ObjectId
): Promise<User_Interface | undefined> {
	// TODO - *MIGHT* need to add a check to make sure the user ID being passed in is in a valid MongoDB format
	try {
		let user: User_Interface | undefined | null;
		if (email) {
			user = await User.findOne({
				email
			});
		} else {
			try {
				if (user_id && mongoose.isValidObjectId(user_id)) {
					user = await User.findOne({
						_id: user_id
					});
				}
			} catch (error) {
				console.log("<auth_controller.ts> [29] ERROR:", error);
				return undefined;
			}
		}

		if (!user) return undefined;

		return user;
	} catch (error) {
		console.log("<auth_controller.ts> [16] ERROR:", error);
		return undefined;
	}
}

const login_google = async (req: Request, res: Response) => {
	const { email, first_name, last_name, full_name, profile_picture } = req.body;
	try {
		const user: User_Interface | undefined = await findUser(email);
		if (user) {
			res.status(409).send("A user already exists with this Google account"); // 409 HTTP code means duplicate data found
		} else {
			const user = await User.create({
				email,
				first_name,
				last_name,
				full_name,
				profile_picture,
				date_joined: new Date().toLocaleDateString("en-US"),
				num_blogs: 0,
				verified: true
			});

			res.status(201).json(user); // 201 HTTP code means new resource created
		}
	} catch (error) {
		console.log("<auth_controller.ts> [44] ERROR:", error);
		res.status(500).send(error);
	}
};

function generateUniqueToken(): string {
	const timestamp: number = new Date().getTime();
	const randomString: string = Math.random().toString(36).substring(2);
	const token: string = timestamp.toString() + randomString;
	return token;
}

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user: User_Interface | undefined = await findUser(email);
	if (user !== undefined) {
		const db_password = user.password; // not all accounts will have the password property (if the user signs in with Google)
		if (db_password) {
			const match = await bcrypt.compare(password, db_password);
			if (match) {
				if (!user.verified) {
					// TODO - Consider first checking if there are any old tokens with the same user id. If they are, delete those (even though they would be deleted 5 minutes later)
					const token = await Token.create({
						token: generateUniqueToken(),
						user_id: user._id
					});
					sendAccountVerificationEmail(
						user.email,
						user.first_name,
						user._id,
						token.token,
						token._id
					);
					res
						.status(500)
						.send("A verification email has been sent to your inbox");
				} else {
					// TODO - add the functionality to create a cookie here for the user and sign them in because they are verified
				}
			} else {
				res.status(500).send("Incorrect password");
			}
		} else {
			res.status(409).send("Sign in with Google");
		}
	} else {
		res.status(404).send("No user exists with this email");
	}
};

function deleteToken(token_id: mongoose.Types.ObjectId) {
	if (mongoose.isValidObjectId(token_id)) {
		setTimeout(async () => {
			await Token.deleteOne({
				_id: token_id
			});
		}, 300000); // will delete in 5 minutes
	} else {
		console.log(
			"<auth_controller.ts> [159] (not an error) - ID is not in valid MongoDB format"
		);
	}
}

const register = async (req: Request, res: Response) => {
	const { first_name, last_name, email, password } = req.body;
	const user: User_Interface | undefined = await findUser(email);
	if (user === undefined) {
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email,
			first_name,
			last_name,
			full_name: `${first_name} ${last_name}`,
			password: hashedPassword,
			date_joined: new Date().toLocaleDateString("en-US"),
			num_blogs: 0,
			verified: false
		});

		const token = await Token.create({
			token: generateUniqueToken(),
			user_id: user._id
		});

		// const token = jwt.sign(user.toObject(), generateUniqueToken(), {
		// 	expiresIn: Math.floor(Date.now() / 1000) + 5 * 60 // 5 minutes
		// });

		const status_code: number = await sendAccountVerificationEmail(
			user.email,
			user.first_name,
			user._id,
			token.token,
			token._id
		);

		if (status_code === 200) deleteToken(token._id);

		res.status(201).send(`A verification email has been sent to ${user.email}`);
	} else {
		res.status(409).send("A user already exists with this email");
	}
};

const verification = async (req: Request, res: Response) => {
	const token = req.params.token_id; // this is just a randomly generated token
	const queryToken = req.query.token; // this is the token (ID) to use in database querying
	const user_id = req.query.uid;
	let token_deleted = false;

	// First need to check if token_id and user_id are valid MongoDB IDs
	// Second need to check if token is an actual existing token and matches the one in the DB
	// Third need to update the user's verified status

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
				// console.log("valid");

				const mongo_uid: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
					user_id
				);

				const user: User_Interface | undefined = await findUser(
					undefined,
					mongo_uid
				);

				if (user !== undefined) {
					await User.findByIdAndUpdate(
						{
							_id: user._id
						},
						{
							verified: true
						}
					);

					// TODO - replace this with deleteToken(db_token._id):
					await Token.deleteOne({
						_id: queryToken
					});

					token_deleted = true;
				} else {
					console.log(
						"<auth_controller.ts> [221] (not an error) - user is not defined"
					);
				}

				if (!token_deleted) deleteToken(db_token._id);
				res.render("verification.ejs", {
					status:
						"Account verified! Click <a href = 'http://localhost:5173/sign-in'>here</a> to sign in!"
				});
			} else {
				// console.log("Not valid");
				res.render("verification.ejs", { status: "There was an error" });
			}
		} else {
			// console.log("This token might have expired or does not exist");
			res.render("verification.ejs", {
				status:
					"This token might have expired or does not exist. Click <a href = 'http://localhost:5173/'>here</a> to head back home"
			});
		}
	} else {
		// console.log("Error");
		res.render("verification.ejs", {
			status: "404"
		});
	}
};

const passwordReset = async (req: Request, res: Response) => {
	// Send an email to the user to basically verify that they were the one to have requested a password reset email
	// This will add a layer of security to prevent users from just guessing people's emails and changing their passwords
	const { email, duplicatePassword: new_password } = req.body;

	const user: User_Interface | undefined = await findUser(email);
	if (user !== undefined) {
		const uniqueToken: string = generateUniqueToken();

		const hashedPassword = await bcrypt.hash(new_password, 10);
		const match = await bcrypt.compare(new_password, user.password!);

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
							"Your account does not appear to be verified. Please check your inbox for an account verification email"
						);
				} else {
					console.log("<auth_controller.ts> [291] ERROR sending email");
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
						"<auth_controller.ts> [316] ERROR - there was an issue sending the user an email"
					);
					res.status(500).send("There was a problem sending an email");
				}
			}
		}
	} else {
		res.status(404).send("No user exists with this email");
	}
};

export { login_google, login, register, verification, passwordReset };
