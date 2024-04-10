import express from "express";
import { autosave } from "../controllers/settings_controller";
const router = express.Router();
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user";
import { User_Interface } from "../interfaces";
import { findUser } from "../controllers/auth_controller";

dotenv.config();

cloudinary.config({
	cloud_name: "dx7gno3uh",
	api_key: process.env.CLOUDINARY_API,
	api_secret: process.env.CLOUDINARY_SECRET
});

// Prefix: /api/user/settings
router.post("/autosave", autosave);

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(__dirname, "./temp_pfps"));
	},
	filename: (req, file, callback) => {
		callback(null, `${Date.now()}-${file.originalname}`);
	}
});

const upload = multer({ storage });

async function handleImageData(
	user_id: mongoose.Types.ObjectId,
	newImageURL: string,
	imageToDeletePath: string,
	newImagePublicID: string
) {
	// TODO - need to think of how to go about deleting the user's old profile picture from Cloudinary once they update it. SEE: https://support.cloudinary.com/hc/en-us/articles/203465641-How-can-I-delete-an-image-via-the-API-Programmable-Media

	try {
		const user: User_Interface | undefined = await findUser(undefined, user_id);
		if (user !== undefined) {
			const oldImagePublicID = user.cloudinaryPfp_ID;

			cloudinary.uploader.destroy(oldImagePublicID);

			fs.unlink(imageToDeletePath, err => {
				if (err) {
					console.error("<settings_routes.ts> [53] Error deleting file:", err);
				} else {
					console.log("Local file deleted successfully");
				}
			});

			await User.findByIdAndUpdate(
				{ _id: user_id },
				{ profile_picture: newImageURL, cloudinaryPfp_ID: newImagePublicID }
			);
		}
	} catch (error) {
		console.log("<settings_routes.ts> [65] ERROR", error);
	}
}

router.post("/upload", upload.single("file"), (req, res) => {
	// const { image_type } = req.body;
	const folderPath = path.join(__dirname, "./temp_pfps");

	fs.readdir(folderPath, (err, files) => {
		if (err) {
			console.error("<settings_routes.ts> [75] Error reading folder:", err);
		} else {
			const files_array: string[] = files;
			const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
			// TODO - may need to add a check to see if user_id is a valid Mongo ID (?)
			if (user_id !== undefined) {
				for (let i = 0; i < files_array.length; i++) {
					const file_path = `${__dirname}/./temp_pfps/${files_array[i]}`;
					cloudinary.uploader
						.upload(file_path)
						.then(result => {
							handleImageData(
								user_id,
								result.secure_url,
								file_path,
								result.public_id
							);
						})
						.catch(error => {
							console.log("<settings_routes.ts> [94] ERROR", error);
						});
				}
			}
		}
	});

	res.send("Successfully uploaded!");
});

export default router;
