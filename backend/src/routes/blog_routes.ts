import express from "express";
import Blog from "../models/blog";
import fs from "fs";
import { upload, FOLDER_PATH, uploadToCloudinary } from "./settings_routes";
import mongoose from "mongoose";
import { findUser } from "../controllers/auth_controller";
import { User_Interface } from "../interfaces";
import slugify from "slugify";
import generateUniqueId from "generate-unique-id";
import {
	getBlog,
	getAllBlogs,
	updateBlogArchiveStatus,
	updateBlogPublishStatus,
	deleteBlog
} from "../controllers/blog_controller";
import User from "../models/user";
const router = express.Router();

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
					const blog_count: number = user.num_blogs;

					const blog = await Blog.create({
						blog_title: blogTitle,
						user_id: user._id,
						route_id: generateUniqueId({
							length: 22,
							excludeSymbols: ["_", "-"]
						}),
						blog_summary: blogSummary,
						sanitized_title: slugify(blogTitle, {
							lower: true,
							remove: /[*+~.()'"!:@]/g
						}),
						blog_content: blogContent,
						blog_author: user.full_name
					});

					await User.findByIdAndUpdate(
						{ _id: user_id },
						{ num_blogs: blog_count + 1 }
					);

					const status_code: number = await uploadToCloudinary(
						user_id,
						files_array,
						image_type,
						blog._id
					);

					if (status_code === 200) {
						res.status(status_code).send({
							status: 200,
							link: `http://localhost:5173/blogs/${blog.route_id}/${blog.sanitized_title}`
						});
					} else {
						res.status(status_code).send("Error");
					}
				}
			}
		}
	});
});

router.get("/blog/:route_id", getBlog);

router.get("/:user_id/all", getAllBlogs);

router.patch("/:blog_id/update-archive-status", updateBlogArchiveStatus);

router.patch("/:blog_id/update-publish-status", updateBlogPublishStatus);

router.delete("/:blog_id/delete-blog", deleteBlog);

export default router;
