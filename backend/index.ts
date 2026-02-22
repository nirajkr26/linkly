import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/config/mongo.config";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import AuthRoutes from "./src/routes/auth.route";
import { errorHandler } from "./src/utils/errorHandler";
import UserRoutes from "./src/routes/user.route";

const app = express();

app.use(passport.initialize());

app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);


app.use(errorHandler);

const Port = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(Port, () => {
        console.log(`Server is running on port ${Port}`);
    })
}).catch((err: Error) => {
    console.log(err);
})