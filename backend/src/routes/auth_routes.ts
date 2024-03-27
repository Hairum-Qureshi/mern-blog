import express from "express";
import { login_google, login, register } from "../controllers/auth_controller";

const router = express.Router();

// Prefix: /api/user
router.post("/google-login", login_google);
router.post("/login", login);
router.post("/create-user", register);

export default router;
