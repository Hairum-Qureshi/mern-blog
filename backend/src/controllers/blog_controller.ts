import { Request, Response } from "express";
import Blog from "../models/blog";
import { Blog_Interface } from "../interfaces";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const getBlog = async (req: Request, res: Response) => {
	const route_id: string = req.params.route_id;
	try {
		const blog: Blog_Interface | null = await Blog.findOne({ route_id });
		if (blog) {
			res.status(200).send(blog);
		} else {
			res.status(404).send({ message: "blog not found" });
		}
	} catch (error) {
		res.status(500).send(error);
	}
};

const getAllBlogs = async (req: Request, res: Response) => {
	const { user_id } = req.params;
	const blogs: Blog_Interface[] = await Blog.find({ user_id });
	if (blogs.length !== 0) {
		res.json(blogs);
	} else {
		res.json({ message: "blogs not found" });
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
	} else {
		res.json({ message: "blog ID is not valid" });
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
			const blog: Blog_Interface[] | null = await Blog.findById({
				_id: mongoID_format
			});
			if (blog) {
				await Blog.deleteOne({
					_id: blog_id
				});
				res.status(200).send("Success");
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
	getAllBlogs,
	updateBlogArchiveStatus,
	updateBlogPublishStatus,
	deleteBlog
};
