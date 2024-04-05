import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import auth_routes from "./routes/auth_routes";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();

const limit = rateLimit({
	max: 500, // maximum requests
	windowMs: 60 * 60 * 1000, // 1 hour in miliseconds
	message: "Too many requests. Please try again in 1 hour."
});

const PORT: string = process.env.PORT!;
const MONGO_URI: string = process.env.MONGO_URI!;

const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true,
	optionSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
	session({
		name: "auth-session",
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: false,
		cookie: {
			// sameSite: "none", // This should be uncommented in production mode
			httpOnly: true, // may need to change this to false upon production
			secure: false, // change to true for https
			maxAge: 345600000 // 4 days
		},
		rolling: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI
		})
	})
);

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
