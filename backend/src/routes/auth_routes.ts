import express from "express";
import { login_google, login, register } from "../controllers/auth_controller";
import {
	verification,
	passwordReset,
	verifyNewPassword
} from "../controllers/verification_controller";

const router = express.Router();

// Prefix: /api/user
router.post("/google-login", login_google);
router.post("/login", login);
router.post("/create-user", register);
router.post("/forgot-password", passwordReset);
router.get("/verify/:token_id", verification);
router.get("/verify/reset-password/:token_id", verifyNewPassword);

export default router;
