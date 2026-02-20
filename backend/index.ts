import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/config/mongo.config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Port = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(Port, () => {
        console.log(`Server is running on port ${Port}`);
    })
}).catch((err: Error) => {
    console.log(err);
})