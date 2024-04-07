import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { User_Interface } from "../interfaces";
import { sendAccountVerificationEmail } from "../nodemailer_files/nodemailer";
import Token from "../models/token";
import mongoose from "mongoose";

// TODO - move all similar/repeated code to new functions!
// TODO - add the logic to create the authentication cookie!

export async function findUser(
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
				console.log("<auth_controller.ts> [32] ERROR:", error);
				return undefined;
			}
		}

		if (!user) return undefined;

		return user;
	} catch (error) {
		console.log("<auth_controller.ts> [40] ERROR:", error);
		return undefined;
	}
}

const login_google = async (req: Request, res: Response) => {
	const { email, first_name, last_name, full_name, profile_picture } = req.body;

	try {
		const user: User_Interface | undefined = await findUser(email);
		if (user) {
			// res.status(409).send("A user already exists with this Google account"); // 409 HTTP code means duplicate data found
			req.session.user_id = user._id;
			res.status(200).send(user._id);
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
			req.session.user_id = user._id;
			res.status(201).send(user._id); // this is important! Without it, the cookie will not be set!
		}
	} catch (error) {
		console.log("<auth_controller.ts> [70] ERROR:", error);
		res.status(500).send(error);
	}
};

export function generateUniqueToken(): string {
	const timestamp: number = new Date().getTime();
	const randomString: string = Math.random().toString(36).substring(2);
	const token: string = timestamp.toString() + randomString;
	return token;
}

export function deleteToken(token_id: mongoose.Types.ObjectId) {
	if (mongoose.isValidObjectId(token_id)) {
		setTimeout(async () => {
			await Token.deleteOne({
				_id: token_id
			});
		}, 300000); // will delete in 5 minutes
	} else {
		console.log(
			"<auth_controller.ts> [90] (not an error) - ID is not in valid MongoDB format"
		);
	}
}

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user: User_Interface | undefined = await findUser(email);
	if (user !== undefined) {
		// Not all accounts will have the password property (if the user signs in with Google)
		const db_password = user.password;
		if (db_password) {
			const match = await bcrypt.compare(password, db_password);
			if (match) {
				if (!user.verified) {
					// TODO - Consider first checking if there are any old tokens with the same user id. If they are, delete those (even though they would be deleted 5 minutes later)
					const token = await Token.create({
						token: generateUniqueToken(),
						user_id: user._id
					});
					const status_code: number = await sendAccountVerificationEmail(
						user.email,
						user.first_name,
						user._id,
						token.token,
						token._id
					);
					if (status_code === 200) {
						res
							.status(403)
							.send("A verification email has been sent to your inbox");
						deleteToken(token._id);
					} else {
						res
							.status(500)
							.send(
								"There was a problem sending an email. Please check your email format"
							);
					}
				} else {
					// TODO - add the functionality to create a cookie here for the user and sign them in because they are verified
					req.session.user_id = user._id;

					res.status(200).send(user._id); // this is important! Without it, the cookie will not be set!
				}
			} else {
				res.status(500).send("Incorrect password");
			}
		} else {
			res.status(409).send("This account is tied to a Google account");
		}
	} else {
		res.status(404).send("No user exists with this email");
	}
};

const register = async (req: Request, res: Response) => {
	const { first_name, last_name, email, password } = req.body;
	const user: User_Interface | undefined = await findUser(email);
	let http_statusCode = 409;
	let message = "A user already exists with this email";
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

		if (status_code === 200) {
			http_statusCode = 201;
			message = `A verification email has been sent to ${user.email}`;
			// res
			// 	.status(201)
			// 	.send(`A verification email has been sent to ${user.email}`);

			deleteToken(token._id);
		} else if (status_code === 500) {
			// res
			// 	.status(500)
			// 	.send(
			// 		"There was a problem sending an email. Please check your email format"
			// 	);
			http_statusCode = 500;
			message =
				"There was a problem sending an email. Please check your email format";
		}
	}
	// res.status(409).send("A user already exists with this email");
	res.status(http_statusCode).send(message);
};

const handleAuthenticatedUser = async (req: Request, res: Response) => {
	const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
	if (user_id) {
		const user: User_Interface | undefined = await findUser(undefined, user_id);
		if (user) {
			const {
				_id: user_id,
				email,
				first_name,
				last_name,
				full_name,
				profile_picture,
				biography,
				followers,
				following,
				date_joined,
				num_blogs,
				show_email,
				social_media,
				backdrop
			} = user;

			res.json({
				user_id,
				email,
				first_name,
				last_name,
				full_name,
				profile_picture,
				biography,
				followers,
				following,
				date_joined,
				num_blogs,
				show_email,
				social_media,
				backdrop
			});
		} else {
			res.json({ message: "user does not exist" });
		}
	} else res.json({ message: "user is not logged in" });
};

const logoutUser = async (req: Request, res: Response) => {
	try {
		req.session.destroy(error => {
			if (error) {
				console.error("<auth_controller.ts> [241] ERROR", error);
				res.status(500).send("Error destroying session");
			} else {
				res.clearCookie("auth-session");
				res.status(200).send("Success");
			}
		});
	} catch (error) {
		console.error("<auth_controller.ts> [248] ERROR", error);
		res.status(500).send("Error destroying session");
	}
};

export { login_google, login, register, handleAuthenticatedUser, logoutUser };
