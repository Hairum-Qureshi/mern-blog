import express, { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import auth_routes from "./routes/auth_routes";

dotenv.config();

const app = express();

const limit = rateLimit({
	max: 500, // maximum requests
	windowMs: 60 * 60 * 1000, // 1 hour in miliseconds
	message: "Too many requests. Please try again in 1 hour."
});

const PORT: string = process.env.PORT!;
const MONGO_URI: string = process.env.MONGO_URI!;

app.use(cors<Request>({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", limit); // middleware to add a rate limit for requests (prevent brute-force attacks)
app.use("/api/user", auth_routes);

app.engine("html", require("ejs").renderFile);

app.get("*", (req, res) => {
	res.status(404).render("404.html");
});

mongoose
	.connect(MONGO_URI)
	.then(() => {
		app.listen(PORT, () => {
			console.log(
				`Successfully connected to MongoDB! Server listening on port ${PORT}`
			);
		});
	})
	.catch(err => {
		console.log(err);
	});
