import express from "express";
import { login_google } from "../controllers/auth_controller";

const router = express.Router();

// Prefix: /api/user
router.post("/google-login", login_google);

export default router;
