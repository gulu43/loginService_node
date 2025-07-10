import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    roomName:{
        types: String,
        unique: true,
        lowercase: true,
        required: true,
    }, 
    sender: {
        types: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    reciver: {
        types: String,
        unique: true,
        lowercase: true,
        required: false,
    },

}, { timestamps: true })

const MessageModel = mongoose.model( "MessageModel", messageSchema ) 

export { MessageModel }