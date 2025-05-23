import mongoose from "mongoose";

const userSchema = new mongoose.Schema( {
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,

    },
    fullName: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true} )

const User = mongoose.model( "User", userSchema);

export { User }