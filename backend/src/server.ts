import express, { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import auth_routes from "./routes/auth_routes";

dotenv.config();

const app = express();
const PORT: string = process.env.PORT!;
const MONGO_URI: string = process.env.MONGO_URI!;

app.use(cors<Request>({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", auth_routes);

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
