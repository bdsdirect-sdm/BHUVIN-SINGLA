import { Router } from "express";
import userRoute from "../routes/userRoutes"
import { ExpressValidator } from "express-validator";

const allRoutes = Router();

const defaultRoutes = [
    {
        path: "/",
        route: userRoute
    }
]

defaultRoutes.forEach((route)=>{
    allRoutes.use(route.path,route.route)
})


export default allRoutes;