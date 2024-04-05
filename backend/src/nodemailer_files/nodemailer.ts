import nodemailer from "nodemailer";
import {
	ACCOUNT_VERIFICATION_HTML,
	PASSWORD_VERIFICATION_HTML
} from "./nodemailerHTML";
import mongoose from "mongoose";

async function sendAccountVerificationEmail(
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
			html: ACCOUNT_VERIFICATION_HTML(
				first_name,
				user_id.toString(),
				token,
				token_id.toString()
			)
		});

		return 200;
	} catch (error) {
		console.log("<nodemailer.ts> [39] ERROR", error);
		return 500;
	}
}

async function sendPassVerificationEmail(
	first_name: string,
	email: string,
	user_id: mongoose.Types.ObjectId,
	uniqueToken: string,
	dbTokenID: mongoose.Types.ObjectId // ID of the token from Mongo
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
			subject: "Digital Dialogue Password Reset Verification",
			html: PASSWORD_VERIFICATION_HTML(
				first_name,
				user_id.toString(),
				uniqueToken,
				dbTokenID.toString()
			)
		});

		return 200;
	} catch (error) {
		console.log("<nodemailer.ts> [75] ERROR", error);
		return 500;
	}
}

export { sendAccountVerificationEmail, sendPassVerificationEmail };
