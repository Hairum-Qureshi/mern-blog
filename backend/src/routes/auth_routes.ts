import express from "express";
import {
	login_google,
	login,
	register,
	verification
} from "../controllers/auth_controller";

const router = express.Router();

// Prefix: /api/user
router.post("/google-login", login_google);
router.post("/login", login);
router.post("/create-user", register);
router.get("/verify/:token_id", verification);

export default router;
