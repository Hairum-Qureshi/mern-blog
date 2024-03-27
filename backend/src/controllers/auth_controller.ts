import { Request, Response } from "express";
import User from "../models/user";

const login_google = async (req: Request, res: Response) => {
	const { email, first_name, last_name, full_name, profile_picture } = req.body;

	try {
		const user = await User.create({
			email,
			first_name,
			last_name,
			full_name,
			profile_picture,
			date_joined: new Date().toLocaleDateString("en-US"),
			num_blogs: 0
		});
	} catch (error) {
		res.status(500).send(error);
	}
};

export { login_google };
