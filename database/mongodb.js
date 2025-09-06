// IMPORT THE MONGOOSE LIBRARY 
import mongoose from "mongoose";

export async function connectToMongo() {
    try {
        // MongoDB connection string
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}
