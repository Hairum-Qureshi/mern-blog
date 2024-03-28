import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { User_Interface } from "../interfaces";
import { sendVerificationEmail } from "../nodemailer_files/nodemailer";

async function findUser(email: string): Promise<User_Interface | undefined> {
	try {
		const user: User_Interface | undefined | null = await User.findOne({
			email
		});

		if (!user) {
			return undefined;
		}

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

const login = async (req: Request, res: Response) => {
	// Also needs to check if the user's account is verified or not. If it's not, resend a new verification email
	const { email, password } = req.body;
	const user: User_Interface | undefined = await findUser(email);
	if (user !== undefined) {
		const db_password = user.password; // not all accounts will have the password property (if the user signs in with Google)
		if (db_password) {
			const match = await bcrypt.compare(password, db_password);
			if (match) {
				if (!user.verified) {
					sendVerificationEmail(user.email, user.first_name);
					res
						.status(500)
						.send(
							"Your account needs to be verified. Please check your inbox for a verification email"
						);
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

		res.status(201).json(user);
	} else {
		res.status(409).send("A user already exists with this email");
	}
};

export { login_google, login, register };
