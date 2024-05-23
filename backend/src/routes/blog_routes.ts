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
import { sendBlogPostNotifEmail } from "../nodemailer_files/nodemailer";
const router = express.Router();

// Prefix: /api/blogs

router.post("/post", upload.single("file"), (req, res) => {
	// TODO - *might* need to find a new Node module to handle text sanitation so it'd be URL friendly

	const { image_type, blogTitle, blogSummary, blogContent, blogTags } =
		req.body;

	fs.readdir(FOLDER_PATH, async (err, files) => {
		if (err) {
			console.error("<blog_routes.ts> [31] Error reading folder:", err);
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
						blog_title:
							blogTitle && blogTitle !== "undefined"
								? blogTitle
								: "Untitled Blog",
						user_id: user._id,
						route_id: generateUniqueId({
							length: 22,
							excludeSymbols: ["_", "-"]
						}),
						blog_summary: blogSummary,
						sanitized_title: slugify(
							blogTitle && blogTitle !== "undefined"
								? blogTitle
								: "Untitled Blog",
							{
								lower: true,
								remove: /[*+~.()'"!:@]/g
							}
						),
						blog_content: blogContent,
						blog_author: user.full_name,
						tags: JSON.parse(blogTags)
					});

					await User.findByIdAndUpdate(
						{ _id: user_id },
						{ num_blogs: blog_count + 1 }
					);

					if (
						user.postNotifSubscriber_emails.length > 0 &&
						user !== undefined
					) {
						for (let i = 0; i < user.postNotifSubscriber_emails.length; i++) {
							const foundUser: User_Interface | undefined = await findUser(
								user.postNotifSubscriber_emails[i]
							);
							if (foundUser !== undefined) {
								const receiver_name = foundUser.first_name;
								sendBlogPostNotifEmail(
									user.first_name,
									user.postNotifSubscriber_emails[i],
									`http://localhost:5173/blogs/${blog.route_id}/${blog.sanitized_title}`,
									blog.blog_title,
									blog.blog_summary,
									receiver_name,
									`http://localhost:5173/user/${blog.user_id}/profile`
								);
							} else {
								// Handles the condition where if a user has their account deleted, their email is still saved, so when the findUser() function cannot find that user based on the email provided, it will remove it from the array
								await User.findByIdAndUpdate(
									{ _id: user_id },
									{
										$pull: {
											postNotifSubscriber_emails:
												user.postNotifSubscriber_emails[i]
										}
									}
								);
							}
						}
					}

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

function compareArrays(dbTags: string[], bodyTags: string[]): boolean {
	if (dbTags.length !== bodyTags.length) {
		return false;
	}

	for (let i = 0; i < dbTags.length; i++) {
		if (dbTags[i] !== bodyTags[i]) {
			return false;
		}
	}

	return true;
}

async function updateBlogData(
	blog: Blog_Interface[],
	blogTitle: string,
	blogSummary: string,
	blogContent: string,
	blogTags: string[],
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
				blog_title:
					blog[0].title === blogTitle
						? blog[0].title
							? blog[0].title
							: "Untitled Blog"
						: blogTitle,
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
						  }),
				tags: compareArrays(blog[0].tags, blogTags) ? blog[0].tags : blogTags
			},
			{ new: true } // returns the updated collection
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
		console.log("<blog_routes.ts>[133] ERROR", error);
	}

	return { status_code };
}

router.put("/:blog_id/edit", upload.single("file"), (req, res) => {
	const { image_type, blogTitle, blogSummary, blogContent, blogTags } =
		req.body;
	const user_id = req.session.user_id;
	const route_id = req.params.blog_id;

	fs.readdir(FOLDER_PATH, async (error, files) => {
		const files_array: string[] = files;
		const blog: Blog_Interface[] | null = await Blog.find({ route_id });

		if (error) {
			console.log("<blog_routes.ts>[149] ERROR", error);
		} else if (user_id !== undefined) {
			if (blog && blog.length !== 0) {
				if (files.length === 0) {
					// no image uploaded
					const returnData: BlogData | undefined = await updateBlogData(
						blog,
						blogTitle,
						blogSummary,
						blogContent,
						JSON.parse(blogTags),
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
						blogTags,
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

router.get("/blog/:route_id/:blog_name", getBlog);

router.get("/:user_id/all", getAllUserBlogs);

router.get("/all", getAllBlogs);

router.patch("/:blog_id/update-archive-status", updateBlogArchiveStatus);

router.patch("/:blog_id/update-publish-status", updateBlogPublishStatus);

router.delete("/:blog_id/delete-blog", deleteBlog);

export default router;
