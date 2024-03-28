import nodemailer from "nodemailer";
import HTML from "./nodemailerHTML";
import mongoose from "mongoose";

async function sendVerificationEmail(
	email: string,
	first_name: string,
	user_id: mongoose.Types.ObjectId,
	token: string,
	token_id: mongoose.Types.ObjectId
) {
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
			html: HTML(first_name, user_id.toString(), token, token_id.toString())
		});

		console.log("Successfully sent email!");
	} catch (error) {
		console.log("<nodemailer.ts> [21] ERROR", error);
	}
}

export { sendVerificationEmail };
