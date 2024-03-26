import express, { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT)!;
const MONGO_URI: string = process.env.MONGO_URI!;

app.use(cors<Request>({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Hello!");
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
