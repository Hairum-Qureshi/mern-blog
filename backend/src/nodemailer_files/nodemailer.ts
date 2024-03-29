import nodemailer from "nodemailer";
import { EMAIL_HTML, RESET_EMAIL } from "./nodemailerHTML";
import mongoose from "mongoose";

async function sendVerificationEmail(
	email: string,
	first_name: string,
	user_id: mongoose.Types.ObjectId,
	token: string,
	token_id: mongoose.Types.ObjectId
): Promise<number> {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.APP_PASS
			}
		});
		await transporter.sendMail({
			from: process.env.EMAIL,
			to: email,
			subject: "Digital Dialogue Account Verification",
			html: EMAIL_HTML(
				first_name,
				user_id.toString(),
				token,
				token_id.toString()
			)
		});

		return 200;
	} catch (error) {
		console.log("<nodemailer.ts> [31] ERROR", error);
		return 500;
	}
}

async function sendPasswordReset(
	email: string,
	first_name: string,
	user_id: string
): Promise<number> {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.APP_PASS
			}
		});
		await transporter.sendMail({
			from: process.env.EMAIL,
			to: email,
			subject: "Digital Dialogue Password Reset",
			html: RESET_EMAIL(email, first_name, user_id)
		});

		return 200;
	} catch (error) {
		console.log("<nodemailer.ts> [59] ERROR", error);
		return 500;
	}
}

export { sendVerificationEmail, sendPasswordReset };
