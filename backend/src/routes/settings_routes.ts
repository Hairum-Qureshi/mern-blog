import express from "express";
import { autosave } from "../controllers/settings_controller";
const router = express.Router();

// Prefix: /api/user/settings
router.post("/autosave", autosave);

export default router;
