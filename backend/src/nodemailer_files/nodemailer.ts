import nodemailer from "nodemailer";
import {
	ACCOUNT_VERIFICATION_HTML,
	PASSWORD_VERIFICATION_HTML
} from "./nodemailerHTML";
import mongoose from "mongoose";

function callEmailAuth(): nodemailer.Transporter {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.APP_PASS
		}
	});

	return transporter;
}

async function sendAccountVerificationEmail(
	email: string,
	first_name: string,
	user_id: mongoose.Types.ObjectId,
	token: string,
	token_id: mongoose.Types.ObjectId
): Promise<number> {
	try {
		const transporter = callEmailAuth();
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
		const transporter = callEmailAuth();
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

async function sendBlogPostNotifEmail(
	author_name: string,
	email: string,
	blog_link: string,
	blog_title: string,
	blog_summary: string,
	receiver_name: string,
	profile_link: string
) {
	try {
		const transporter = callEmailAuth();
		await transporter.sendMail({
			from: process.env.EMAIL,
			to: email,
			subject: `[DIGITAL DIALOGUE] ${author_name} just posted a new blog!`,
			html: `Hello, ${receiver_name}! You've subscribed to receiving blog post notifications whenever ${author_name} makes a new post. They just posted a new blog titled "${blog_title}" and it's about: <br /> <br /> <i>${blog_summary}</i>. <br /> <br /> If you find this to be an interesting read, <a href = "${blog_link}">click here to read it</a>! <br /> <br /> Please note that if you attempt to read the linked blog and you're redirected to a 404 page, the blog may be archived, unpublished, or deleted. This is not an error on our end. <br /> <br /> <b><i>If you would like to stop receiving post notifications from this user, <a href = "${profile_link}">click here to visit their profile</a>. From there, re-click the bell icon to mute notifications from this user.</i></b>`
		});
		return 200;
	} catch (error) {
		console.log("<nodemailer.ts> [89] ERROR", error);
		return 500;
	}
}

export {
	sendAccountVerificationEmail,
	sendPassVerificationEmail,
	sendBlogPostNotifEmail
};
