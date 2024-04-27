import { Request, Response } from "express";
import Blog from "../models/blog";
import { Blog_Interface } from "../interfaces";

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
	const blogs = await Blog.find({ user_id });
	if (blogs.length !== 0) {
		res.json(blogs);
	} else {
		res.json({ message: "blogs not found" });
	}
};

export { getBlog, getAllBlogs };
