import express from "express";
const router = express.Router();
import Blog from "../models/blog";
import User from "../models/user";

// Prefix: /api/blogs
router.post("/post", (req, res) => {});

export default router;
