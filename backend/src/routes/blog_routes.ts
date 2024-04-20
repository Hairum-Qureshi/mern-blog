import express from "express";
const router = express.Router();
import Blog from "../models/blog";
import User from "../models/user";
import { handleImageData } from "./settings_routes";

// Prefix: /api/blogs
router.post("/post", (req, res) => {});

export default router;
