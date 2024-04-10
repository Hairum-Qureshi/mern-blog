import express from "express";
import { autosave } from "../controllers/settings_controller";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user";
import { User_Interface } from "../interfaces";
import { findUser } from "../controllers/auth_controller";

const router = express.Router();

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
	newImagePublicID: string,
	image_type: string
) {
	try {
		const user: User_Interface | undefined = await findUser(undefined, user_id);
		if (user !== undefined) {
			const oldImagePublicID = user.cloudinaryPfp_ID;

			// Deletes the old image from Cloudinary:
			cloudinary.uploader.destroy(oldImagePublicID);

			// Deletes the image from the "temp_pfps" folder:
			fs.unlink(imageToDeletePath, err => {
				if (err) {
					console.error("<settings_routes.ts> [54] Error deleting file:", err);
				} else {
					console.log("Local file deleted successfully");
				}
			});

			if (image_type && image_type === "pfp") {
				await User.findByIdAndUpdate(
					{ _id: user_id },
					{ profile_picture: newImageURL, cloudinaryPfp_ID: newImagePublicID }
				);
			} else {
				await User.findByIdAndUpdate(
					{ _id: user_id },
					{ backdrop: newImageURL, cloudinaryBackdrop_ID: newImagePublicID }
				);
			}
		}
	} catch (error) {
		console.log("<settings_routes.ts> [66] ERROR", error);
	}
}

router.post("/upload", upload.single("file"), (req, res) => {
	const { image_type } = req.body;
	const folderPath = path.join(__dirname, "./temp_pfps");

	fs.readdir(folderPath, (err, files) => {
		if (err) {
			console.error("<settings_routes.ts> [76] Error reading folder:", err);
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
								result.public_id,
								image_type
							);
						})
						.catch(error => {
							console.log("<settings_routes.ts> [95] ERROR", error);
						});
				}
			}
		}
	});

	res.send("Successfully uploaded!");
});

export default router;
