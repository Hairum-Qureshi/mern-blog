import express from "express";
import { autosave } from "../controllers/settings_controller";
const router = express.Router();
import multer from "multer";
import path from "path";

// Prefix: /api/user/settings
router.post("/autosave", autosave);

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(__dirname, "./temp_uploads"));
	},
	filename: (req, file, callback) => {
		callback(null, `${Date.now()}-${file.originalname}`);
	}
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
	console.log(req.file);
	res.send("Successfully uploaded!");
});

export default router;
