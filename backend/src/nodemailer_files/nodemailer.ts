import nodemailer from "nodemailer";
import HTML from "./nodemailerHTML";

async function sendVerificationEmail(email: string, first_name: string) {
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
			html: HTML(first_name)
		});

		console.log("Successfully sent email!");
	} catch (error) {
		console.log("<nodemailer.ts> [21] ERROR", error);
	}
}

export { sendVerificationEmail };
