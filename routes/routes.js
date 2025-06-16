import express from "express"
import { upload } from "../middleware/multer.js";
import { getAllUsers, loginUser, signupUser, autoUserLogin, logoutUser} from "../controllers/user.controller.js"

const router = express.Router();
// console.log("router",router);

// here?
router.get("/udata", getAllUsers )

router.post("/login", loginUser )
router.post("/logout", logoutUser )

router.post("/auth/refresh", autoUserLogin);

router.post("/signup", upload.single("profilePhoto"), signupUser )

export { router };
