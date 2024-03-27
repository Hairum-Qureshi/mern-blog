import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import user from "../models/user";

interface User_Interface {
	_id: string;
	email: string;
	first_name: string;
	last_name: string;
	full_name?: string;
	password?: string;
	profile_picture: string;
	date_joined?: string;
	num_blogs: number;
}

async function findUser(email: string): Promise<User_Interface | undefined> {
	try {
		// Returning the promise here
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
				num_blogs: 0
			});

			res.status(201).json(user); // 201 HTTP code means new resource created
		}
	} catch (error) {
		res.status(500).send(error);
	}
};

const login = async (req: Request, res: Response) => {
	// Request does not seem to be working correction
	const { email, password } = req.body;

	const hashedPassword = await bcrypt.hash(password, 10);

	const user: User_Interface | undefined = await findUser(email);
	if (user !== undefined) {
		const db_password = user.password; // not all accounts will have the password property (if the user signs in with Google)
		if (db_password) {
			const match = await bcrypt.compare(db_password, hashedPassword);
			if (match) {
				console.log(user);
			} else {
				res.status(500).send("Incorrect password");
			}
		} else {
			res.status(409).send("Sign in with Google");
		}
	} else {
		res.status(404).send("User does not exist");
	}
};

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
			num_blogs: 0
		});

		res.status(201).json(user);
	} else {
		res.status(409).send("A user already exists with this email");
	}
};

export { login_google, login, register };
