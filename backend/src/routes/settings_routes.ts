import express from "express";
import {
	autosave,
	autosaveSocialMedia
} from "../controllers/settings_controller";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user";
import { Blog_Interface, User_Interface } from "../interfaces";
import { findUser } from "../controllers/auth_controller";
import Blog from "../models/blog";

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
		callback(null, path.join(__dirname, "./temp_images"));
	},
	filename: (req, file, callback) => {
		callback(null, `${Date.now()}-${file.originalname}`);
	}
});

export const upload = multer({ storage });
export const FOLDER_PATH = path.join(__dirname, "./temp_images");

export async function handleImageData(
	user_id: mongoose.Types.ObjectId,
	newImageURL: string,
	imageToDeletePath: string,
	newImagePublicID: string,
	image_type: string,
	ref_id?: mongoose.Types.ObjectId
): Promise<number> {
	try {
		const user: User_Interface | undefined = await findUser(undefined, user_id);
		if (user !== undefined) {
			// Deletes the image from the "temp_images" folder:
			fs.unlink(imageToDeletePath, err => {
				if (err) {
					console.error("<settings_routes.ts> [54] Error deleting file:", err);
					return 500;
				} else {
					// console.log("Local file deleted successfully");
					return 200;
				}
			});

			if (image_type && image_type === "pfp") {
				const oldImagePublicID = user.cloudinaryPfp_ID;

				// Deletes the old image from Cloudinary:
				cloudinary.uploader.destroy(oldImagePublicID);
				try {
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{ profile_picture: newImageURL, cloudinaryPfp_ID: newImagePublicID }
					);
					return 200;
				} catch (error) {
					console.log("<settings_routes.ts> [76] ERROR", error);
					return 500;
				}
			} else if (image_type && image_type === "backdrop") {
				const oldBackdropPublicID = user.cloudinaryBackdrop_ID;

				// Deletes the old image from Cloudinary:
				cloudinary.uploader.destroy(oldBackdropPublicID);
				try {
					await User.findByIdAndUpdate(
						{ _id: user_id },
						{ backdrop: newImageURL, cloudinaryBackdrop_ID: newImagePublicID }
					);
					return 200;
				} catch (error) {
					console.log("<settings_routes.ts> [91] ERROR", error);
					return 500;
				}
			} else {
				// TODO - may need to add a check if the code is null/undefined:
				const blog: Blog_Interface | null = await Blog.findOne({
					_id: ref_id
				});
				if (blog) {
					const oldImagePublicID = blog.cloudinaryThumbnail_ID;

					// Deletes the old image from Cloudinary:
					cloudinary.uploader.destroy(oldImagePublicID);
					try {
						await Blog.findByIdAndUpdate(
							{ _id: ref_id },
							{
								blog_thumbnail: newImageURL,
								cloudinaryThumbnail_ID: newImagePublicID
							}
						);
						return 200;
					} catch (error) {
						console.log("<settings_routes.ts> [114] ERROR", error);
						return 500;
					}
				}
			}
		}
	} catch (error) {
		console.log("<settings_routes.ts> [121] ERROR", error);
		return 500;
	}

	return 200;
}

export async function uploadToCloudinary(
	user_id: mongoose.Types.ObjectId,
	files_array: string[],
	image_type: string,
	ref_id?: mongoose.Types.ObjectId
): Promise<number> {
	let stat_code = 500;
	try {
		await Promise.all(
			files_array.map(async (file: string) => {
				const file_path = `${__dirname}/./temp_images/${file}`;
				const result = await cloudinary.uploader.upload(file_path);
				const status_code = await handleImageData(
					user_id,
					result.secure_url,
					file_path,
					result.public_id,
					image_type,
					ref_id!
				);
				stat_code = status_code;
			})
		);
	} catch (error) {
		console.log("<settings_routes.ts> [124] ERROR", error);
		stat_code = 500;
	}

	return stat_code;
}

router.post("/upload", upload.single("file"), (req, res) => {
	const { image_type } = req.body;
	fs.readdir(FOLDER_PATH, async (err, files) => {
		if (err) {
			console.error("<settings_routes.ts> [135] Error reading folder:", err);
		} else {
			const files_array: string[] = files;
			const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
			// TODO - may need to add a check to see if user_id is a valid Mongo ID (?)
			if (user_id !== undefined) {
				const status_code: number = await uploadToCloudinary(
					user_id,
					files_array,
					image_type
				);
				if (status_code === 200) {
					res.status(status_code).send("Success");
				} else {
					res.status(status_code).send("Error");
				}
			}
		}
	});
});

router.post("/autosave/social-media", autosaveSocialMedia);

export default router;
