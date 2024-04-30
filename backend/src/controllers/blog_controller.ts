import { Request, Response } from "express";
import Blog from "../models/blog";
import { Blog_Interface } from "../interfaces";
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

const archiveBlog = async (req: Request, res: Response) => {
	const { blog_id: route_id } = req.params;
	const { archive_this } = req.body;
	try {
		const blogs: Blog_Interface[] = await Blog.find({ route_id });
		if (blogs.length !== 0) {
			await Blog.findByIdAndUpdate(
				{ _id: blogs[0]._id },
				{ archived: archive_this }
			);
			res.status(200).send("Success");
		} else {
			res.status(404).send("No blogs found");
		}
	} catch (error) {
		console.log("<blog_controller.ts> [45] ERROR", error);
		res.status(500).send("There was a problem");
	}
};

export { getBlog, getAllBlogs, archiveBlog };
