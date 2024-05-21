import express from "express";
import Blog from "../models/blog";
import fs from "fs";
import { upload, FOLDER_PATH, uploadToCloudinary } from "./settings_routes";
import mongoose from "mongoose";
import { findUser } from "../controllers/auth_controller";
import { BlogData, Blog_Interface, User_Interface } from "../interfaces";
import slugify from "slugify";
import generateUniqueId from "generate-unique-id";
import {
	getBlog,
	getAllUserBlogs,
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
			console.error("<blog_routes.ts> [30] Error reading folder:", err);
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

async function updateBlogData(
	blog: Blog_Interface[],
	blogTitle: string,
	blogSummary: string,
	blogContent: string,
	uploadingImage: boolean,
	user_id: mongoose.Types.ObjectId,
	image_type: string,
	files_array?: string[]
): Promise<BlogData> {
	let status_code = 200;

	try {
		const updatedBlogData: Blog_Interface = (await Blog.findByIdAndUpdate(
			{ _id: blog[0]._id },
			{
				blog_title: blog[0].title === blogTitle ? blog[0].title : blogTitle,
				blog_summary:
					blog[0].blog_summary === blogSummary
						? blog[0].blog_summary
						: blogSummary,
				blog_content:
					blog[0].blog_content === blogContent
						? blog[0].blog_content
						: blogContent,
				sanitized_title:
					blog[0].title === blogTitle
						? blog[0].sanitized_title
						: slugify(blogTitle, {
								lower: true,
								remove: /[*+~.()'"!:@]/g
						  })
			}
		)) as unknown as Blog_Interface;

		if (uploadingImage && files_array !== undefined) {
			status_code = await uploadToCloudinary(
				user_id,
				files_array,
				image_type,
				blog[0]._id
			);
		}

		return { status_code, updatedBlogData };
	} catch (error) {
		status_code = 500;
		console.log("<blog_routes.ts>[122] ERROR", error);
	}

	return { status_code };
}

router.put("/:blog_id/edit", upload.single("file"), (req, res) => {
	const { image_type, blogTitle, blogSummary, blogContent } = req.body;
	const user_id = req.session.user_id;
	const route_id = req.params.blog_id;

	fs.readdir(FOLDER_PATH, async (error, files) => {
		const files_array: string[] = files;
		const blog: Blog_Interface[] | null = await Blog.find({ route_id });

		if (error) {
			console.log("<blog_routes.ts>[89] ERROR", error);
		} else if (user_id !== undefined) {
			if (blog && blog.length !== 0) {
				if (files.length === 0) {
					// no image uploaded
					const returnData: BlogData | undefined = await updateBlogData(
						blog,
						blogTitle,
						blogSummary,
						blogContent,
						false,
						user_id,
						image_type
					);

					if (returnData.updatedBlogData !== undefined) {
						if (returnData.status_code === 200) {
							res.status(returnData.status_code).send({
								status: 200,
								link: `http://localhost:5173/blogs/${returnData.updatedBlogData.route_id}/${returnData.updatedBlogData.sanitized_title}`
							});
						} else {
							res.status(returnData.status_code).send("Error");
						}
					}
				} else {
					const returnData: BlogData = await updateBlogData(
						blog,
						blogTitle,
						blogSummary,
						blogContent,
						true,
						user_id,
						image_type,
						files_array
					);
					if (returnData.updatedBlogData !== undefined) {
						if (returnData.status_code === 200) {
							res.status(returnData.status_code).send({
								status: 200,
								link: `http://localhost:5173/blogs/${returnData.updatedBlogData.route_id}/${returnData.updatedBlogData.sanitized_title}`
							});
						} else {
							res.status(returnData.status_code).send("Error");
						}
					}
				}
			} else {
				res.status(404).send("Not found");
			}
		} else {
			res.status(401).send("Unauthorized");
		}
	});
});

router.get("/blog/:route_id", getBlog);

router.get("/:user_id/all", getAllUserBlogs);

router.get("/all", getAllBlogs);

router.patch("/:blog_id/update-archive-status", updateBlogArchiveStatus);

router.patch("/:blog_id/update-publish-status", updateBlogPublishStatus);

router.delete("/:blog_id/delete-blog", deleteBlog);

export default router;
