import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoUrl = process.env.MONGODB_URL;

        if (!mongoUrl) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }

        const conn = await mongoose.connect(mongoUrl, {
            dbName: "linkly"
        });

        console.log("MongoDB Connected");
    } catch (error) {
        const err = error as Error;
        console.error(`Error in mongoDB connection - ${err}`);
        process.exit(1);
    }
};

export default connectDB;