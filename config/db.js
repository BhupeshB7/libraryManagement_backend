import mongoose from "mongoose";

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/library_management_system?replicaSet=rs0";

if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
    console.warn(
        "Warning: MONGODB_URI is not set. The default local database is being used. " +
        "Make sure to set a valid MongoDB connection string in production."
    );
}

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGODB_URI, {
            autoIndex: process.env.NODE_ENV === "development",
        });

        console.log(`MongoDB Connected: ${connection.connection.host}`);

        const gracefulShutdown = async () => {
            try {
                await mongoose.connection.close();
                console.info("MongoDB connection closed due to app termination");
                process.exit(0);
            } catch (err) {
                console.error("Error during MongoDB disconnect", err);
                process.exit(1);
            }
        };

        process.on("SIGINT", gracefulShutdown);
        process.on("SIGTERM", gracefulShutdown);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
