import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = async (localPath) => {

    try {
        
        if (!localPath) {
            console.error('cold not find the path');
        }

        const response = await cloudinary.uploader.upload(localPath, { folder: "profilePhosts"})
        
        fs.unlinkSync(localPath)
        return response

    } catch (error) {
        console.log("Error while uploading to cloudinary", error);
        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }
    }

}

export { uploadToCloudinary }
