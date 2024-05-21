import { Request, Response } from "express";
import Blog from "../models/blog";
import User from "../models/user";
import { Blog_Interface, User_Interface } from "../interfaces";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const getBlog = async (req: Request, res: Response) => {
	const route_id: string = req.params.route_id;
	const blog_name: string = req.params.blog_name;
	try {
		const blog: Blog_Interface | null = await Blog.findOne({
			route_id,
			sanitized_title: blog_name
		});
		if (blog) {
			res.status(200).send(blog);
		} else {
			res.status(404).send({ message: "blog not found" });
		}
	} catch (error) {
		res.status(500).send(error);
	}
};

const getAllUserBlogs = async (req: Request, res: Response) => {
	const { user_id } = req.params;
	const blogs: Blog_Interface[] | null = await Blog.find({ user_id });
	if (blogs && blogs.length !== 0) {
		res.status(200).json(blogs);
	} else {
		res.status(404).json({ message: "blogs not found" });
	}
};

const getAllBlogs = async (req: Request, res: Response) => {
	const all_blogs: Blog_Interface[] | null = await Blog.find({});
	if (all_blogs && all_blogs.length > 0) {
		res.status(200).json(all_blogs);
	} else {
		res.status(404).json({ message: "no blogs" });
	}
};

async function updateBlogData(
	blog_id: string,
	dataPropertyToUpdate: string,
	dataToUpdate: boolean,
	res: Response
) {
	// checks if the string blog ID is a valid mongo ID
	if (ObjectId.isValid(blog_id)) {
		// if it is, it converts the string blog ID to a Mongo Object ID:
		const mongoID_format: mongoose.Types.ObjectId = new ObjectId(blog_id);
		try {
			const blog: Blog_Interface[] | null = await Blog.findById({
				_id: mongoID_format
			});
			if (blog) {
				if (dataPropertyToUpdate === "archived") {
					await Blog.findByIdAndUpdate(
						{ _id: mongoID_format },
						{ archived: dataToUpdate }
					);
				} else {
					await Blog.findByIdAndUpdate(
						{ _id: mongoID_format },
						{ published: dataToUpdate }
					);
				}
				res.status(200).send("Success");
			} else {
				res.status(404).send("No blogs found");
			}
		} catch (error) {
			console.log("<blog_controller.ts> [62] ERROR", error);
		}
	} else {
		res.json({ message: "blog ID is not valid" });
	}
}

const updateBlogArchiveStatus = async (req: Request, res: Response) => {
	const { blog_id } = req.params;
	const { archive_this } = req.body;
	if (blog_id) {
		updateBlogData(blog_id, "archived", archive_this, res);
	}
};

const updateBlogPublishStatus = async (req: Request, res: Response) => {
	const { blog_id } = req.params;
	const { publish_this } = req.body;
	if (blog_id) {
		updateBlogData(blog_id, "published", publish_this, res);
	}
};

const deleteBlog = async (req: Request, res: Response) => {
	const { blog_id } = req.params;
	if (ObjectId.isValid(blog_id)) {
		const mongoID_format: mongoose.Types.ObjectId = new ObjectId(blog_id);
		try {
			const blog: Blog_Interface | null = await Blog.findById({
				_id: mongoID_format
			});
			if (blog) {
				const current_userID: mongoose.Types.ObjectId | undefined =
					req.session.user_id;
				if (current_userID !== undefined) {
					const user: User_Interface | null = await User.findById({
						_id: current_userID
					});
					if (user) {
						const blogCount: number = user.num_blogs;
						const blogThumbnailID: string = blog.cloudinaryThumbnail_ID;

						await Blog.deleteOne({
							_id: blog_id
						});

						await User.findByIdAndUpdate(
							{ _id: current_userID },
							{ num_blogs: blogCount === 0 ? 0 : blogCount - 1 }
						);

						cloudinary.uploader.destroy(blogThumbnailID);

						res.status(200).send("Success");
					}
				} else {
					console.log("User is not logged in");
				}
			} else {
				res.status(404).send("Blog does not exist");
			}
		} catch (error) {
			console.log("<blog_controller.ts> [104] Error deleting blog", error);
		}
	}
};

export {
	getBlog,
	getAllUserBlogs,
	getAllBlogs,
	updateBlogArchiveStatus,
	updateBlogPublishStatus,
	deleteBlog
};
