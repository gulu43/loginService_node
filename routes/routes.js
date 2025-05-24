import express from "express"
import { getAllUsers, loginUser, signupUser} from "../controllers/user.controller.js"

const router = express.Router();
// console.log("router",router);

router.get("/udata", getAllUsers )

router.post("/login", loginUser )

router.post("/signup", signupUser )

export { router };
