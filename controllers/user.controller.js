import { User } from "../models/user.model.js";

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
            return req.status(400)
            .json({
                message: "User Does not exsist, Plz Register first"
            })
        }

        if (email == dbUser.email && password == dbUser.password) {
            return res.status(300)
            .json({
                data: dbUser.select("-_id"),
                message2:"you loged-in"
            })
        }else{
            return res.status(404)
            .json({ message: " email or password is incorrect "})
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
        console.log("values-> ",email, fullName, password);
        

        const userExisting = await User.findOne({ email: email })

        if (userExisting) {
            return res
            .status(400)
            .json({
                msg: "User allready exists"
            });
        }
        const user = await User.create({email, fullName, password});
        return res
        .status(200)
        .json(user)
    } catch (error) {
        res.status(500).json({ "error": error?.message });
    }
    
}

export { getAllUsers, loginUser, signupUser }