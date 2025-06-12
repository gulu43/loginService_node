import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Get directory of current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
    dotenv.config({
        path: path.resolve(__dirname, "../.env") 
    });
}


// console.log("DB URL:", process.env.MONGO_URL); 

async function connectDbFn() {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URL)
        console.log(`\n MongoDB connected!, DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("\n MongoDB connection FAILED", error?.message);

    }
    
}

// connectDbFn(); //for testing of DB connection

export { connectDbFn }
