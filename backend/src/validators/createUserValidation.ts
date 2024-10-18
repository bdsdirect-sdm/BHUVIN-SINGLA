import { Request, Response, NextFunction } from "express";
import {check,} from "express-validator"
import {validateUser} from "../middlewares/feildValidator"
export  const createPostValidator = [
    check("firstName")
        .not()
        .isEmpty()
        .withMessage("First Name is required"),

    check("email")
        .not()
        .isEmpty()
        .withMessage("Email is empty")
        .isEmail()
        .withMessage("Email is required"),

    check("phoneNo")
        .not()
        .isEmpty()
        .withMessage("Contact  Number is required"),

    check("gender")
        .isIn(["male",  "female", "other"])
        .withMessage("gender should be male , female or other"),

    check("user_type")
        .not()
        .isEmpty()
        .withMessage("User Type is required")
        .isIn(["Agency", "Job_Seeker"])
        .withMessage("Role should be selected"),
    check("agency")
        .optional()
        .isString()
        .withMessage("agenct should be string"),
        

    (req:Request, res:Response, next:NextFunction) =>{
        validateUser(req, res, next);
    }
];

