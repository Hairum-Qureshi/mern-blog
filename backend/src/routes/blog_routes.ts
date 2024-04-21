import express from "express";
const router = express.Router();
import Blog from "../models/blog";
import fs from "fs";
import { upload, FOLDER_PATH, uploadToCloudinary } from "./settings_routes";
import mongoose from "mongoose";
import { findUser } from "../controllers/auth_controller";
import { User_Interface } from "../interfaces";
import { sanitizeUrl } from "@braintree/sanitize-url";

// Prefix: /api/blogs
router.post("/post", upload.single("file"), (req, res) => {
	// TODO - *might* need to find a new Node module to handle text sanitation so it'd be URL friendly

	const { image_type, blogTitle, blogSummary, blogContent } = req.body;

	fs.readdir(FOLDER_PATH, async (err, files) => {
		if (err) {
			console.error("<blog_routes.ts> [13] Error reading folder:", err);
		} else {
			const files_array: string[] = files;
			const user_id: mongoose.Types.ObjectId | undefined = req.session.user_id;
			// TODO - may need to add a check to see if user_id is a valid Mongo ID (?)
			if (user_id !== undefined) {
				const user: User_Interface | undefined = await findUser(
					undefined,
					user_id
				);
				if (user !== undefined) {
					const blog = await Blog.create({
						title: blogTitle,
						route_id: Math.random().toString(5).slice(2),
						blog_summary: blogSummary,
						sanitized_title: sanitizeUrl(blogTitle),
						blog_content: blogContent,
						blog_author: user.full_name
					});

					const status_code: number = await uploadToCloudinary(
						user_id,
						files_array,
						image_type,
						blog._id
					);

					if (status_code === 200) {
						res.status(status_code).send("Success");
					} else {
						res.status(status_code).send("Error");
					}
				}
			}
		}
	});
});

export default router;
