import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../utils/cloudinary.js";
// import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import ms from "ms";


import path from "path"; // Make sure this is imported at the top
import { fileURLToPath } from 'url'; // Needed if you're using ES Modules
import { dirname } from 'path';

// ES Module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const salt = async()=>{
    return await bcrypt.genSalt(10)
}

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({}).select("-_id -createdAt -updatedAt -__v -fullName -password")
        return res.status(200)
        .json( allUsers )
    } catch (error) {
        return res.status(500)
        .json({ meg: "server error",
            error: error?.message})
    }
}
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        if ( !email || !password ) {
            return res.status(400)
        .json({
            message: "Fiels are reqired",
        })           
        }

        const dbUser = await User.findOne({ email })

        if (!dbUser) {
            return res.status(400)
            .json({
                message: "User Does not exsist, Plz Register first"
            })
        }

        console.log("email from frontend:", email);
        console.log("email in db:", dbUser.email);
        console.log("password from frontend:", password);
        console.log("password in db:", dbUser.password);
        console.log("dbUser fetched:", dbUser);
        console.log("profilePhoto from dbUser :", dbUser.profilePhoto);

        const isMatch = await bcrypt.compare(password, dbUser.password)
        console.log("password matching",isMatch);
        
        if (email == dbUser.email && isMatch) {
            console.log("loged-in in backend");
            
            // for send the jwt token
            await refreshUserLogin(req, res, dbUser);

            return res.status(200)
            .json({
                data: dbUser,
                message:"you loged-in"
            })
        }else{
            return res.status(404)
            .json({ message: "email or password is incorrect "})
        }

    } catch (error) {
        return res.status(500)
        .json({
            message: error?.message
        })
    }
}
const signupUser = async ( req, res ) => {
    
    try {
        const {email, fullName, password} = req.body;
        const profilePhoto = req.file?.filename || "";
        
        console.log(" server values-> ",email, fullName, password, profilePhoto);
        

        const userExisting = await User.findOne({ email: email })

        if (userExisting) {
            return res
            .status(400)
            .json({
                message: "User allready exists"
            });
        }

        // upload to cloudinary
        let cloudinaryPhotoUrl = "";
        if (profilePhoto != "") {
            const localFilePath = path.join(__dirname, "../uploades", profilePhoto);
            
            const result = await uploadToCloudinary(localFilePath);   
            if (result?.secure_url) {
                cloudinaryPhotoUrl = result.secure_url;
            }
        }

        // encreapt the password
        const encryptedPassword = await bcrypt.hash(password, await salt())

        const user = await User.create({email, fullName, password: encryptedPassword, profilePhoto: cloudinaryPhotoUrl});
        return res
        .status(200)
        .json(user)
    } catch (error) {
        res.status(500).json({ "error": error });
    }
    
}

const autoUserLogin = async ( req, res ) => {
    
    const accessToken = req.cookies?.accessTokenHeader;
    console.log("cookiee ",accessToken);
    
    // checking if empty
    if (accessToken == undefined || accessToken == null) {
        
        return res
        .status(401)
        .json({ message: `Cookiee expire or its first time login
                , please login again `
            })
        // .redirect("/login") handle it with frontend not backend
    }
    
    // checking if its expire or not
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        console.log("decoded cookiee ",decoded);
        
        const userFromToken = await User.findById(decoded._id);
        console.log("user from token getting from mongodb ",userFromToken);
        
        //  || userFromToken.refreshToken != accessToken 
        if (!userFromToken) {
            return res
            .status(403)
            .json({ message: "Invalid refresh token" })
            // .redirect("/login") handle it with frontend not backend
        }

        return res
        .status(200)
        .json({ message: `You Auto loged-in JWT token` })

    } catch (error) {
        return res
        .status(401)
        .json({ message: `Refresh token expired or invalid
                , please login again \n ${error}`
            })
        // .redirect("/login") handle it with frontend not backend
    }
    

}

const refreshUserLogin = async (req, res, dbUser) => {
    // just after login

    const { email } = req.body;

    const accessTokenNew = jwt.sign({
        "_id": dbUser._id,
        email,
        "fullName": dbUser.fullName
    }, process.env.ACCESS_TOKEN_SECRET
    , { 
        "expiresIn": `${process.env.ACCESS_TOKEN_EXPIRY}`
    })

    // ADD TO  COOKIE
    res.cookie("accessTokenHeader", accessTokenNew, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strick" : "Lax",
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY)
    })

    const refressTokenNew = jwt.sign( {
        "_id": dbUser._id,
        email,
        "fullName": dbUser.fullName
    }, process.env.REFRESH_TOKEN_SECRET
    , { 
        "expiresIn": `${process.env.REFRESH_TOKEN_EXPIRY}`
    })

    dbUser.refreshToken = refressTokenNew;
    await dbUser.save();

}

export { getAllUsers, loginUser, signupUser, autoUserLogin, refreshUserLogin }

