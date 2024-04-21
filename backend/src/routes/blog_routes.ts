import express from "express";
const router = express.Router();
import Blog from "../models/blog";
import User from "../models/user";
import fs from "fs";
import { upload, FOLDER_PATH, uploadToCloudinary } from "./settings_routes";
import mongoose from "mongoose";

// Prefix: /api/blogs
router.post("/post", upload.single("file"), (req, res) => {
	fs.readdir(FOLDER_PATH, async (err, files) => {
		if (err) {
			console.error("<blog_routes.ts> [13] Error reading folder:", err);
		} else {
			const files_array: string[] = files;
			const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
			// TODO - may need to add a check to see if user_id is a valid Mongo ID (?)
			if (user_id !== undefined) {
				const status_code: number = await uploadToCloudinary(
					user_id,
					files_array,
					"blog_thumbnail"
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

export default router;
