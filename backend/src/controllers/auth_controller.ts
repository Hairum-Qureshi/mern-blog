import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { User_Interface } from "../interfaces";
import { sendVerificationEmail } from "../nodemailer_files/nodemailer";
import jwt from "jsonwebtoken";
import Token from "../models/token";

async function findUser(email: string): Promise<User_Interface | undefined> {
	try {
		const user: User_Interface | undefined | null = await User.findOne({
			email
		});

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
					const token = await Token.create({
						token: generateUniqueToken()
					});

					sendVerificationEmail(
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
					console.log(user);
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

const register = async (req: Request, res: Response) => {
	// Send an account verification email to the user
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
			token: generateUniqueToken()
		});

		// const token = jwt.sign(user.toObject(), generateUniqueToken(), {
		// 	expiresIn: Math.floor(Date.now() / 1000) + 5 * 60 // 5 minutes
		// });

		sendVerificationEmail(
			user.email,
			user.first_name,
			user._id,
			token.token,
			token._id
		);

		setTimeout(() =>
			// Include logic to delete the token

			{}, 300000); // will delete in 5 minutes

		res
			.status(201)
			.send(`An verification email has been sent to ${user.email}`);
	} else {
		res.status(409).send("A user already exists with this email");
	}
};

export { login_google, login, register };
