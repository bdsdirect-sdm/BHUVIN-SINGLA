import { Router } from "express"

import { createPostValidator } from "../validators/createUserValidation"
import { getAllAgencies, getMyAgency, updatePassword, userLogin, userSignup, getAllSeekers } from "../controllers/userController"
import imagaeuploader from "../middlewares/multer.middlerware"
import { auth } from "../middlewares/authMiddleware"

const userRoute = Router()

userRoute.post('/signup', imagaeuploader.fields([{ name: "profile_image", maxCount: 1 }, { name: "resume", maxCount: 1 }]), createPostValidator, userSignup)
userRoute.post("/login", userLogin)
userRoute.get("/getAllAgency", getAllAgencies)
userRoute.put("/updatePassword", auth, updatePassword)
userRoute.get("/getMyAgency", auth, getMyAgency)
userRoute.get("/getAllSeekers", auth, getAllSeekers)
// userRoute.get("/changeSeekerStatus", changeSeekerStatus)

export default userRoute;