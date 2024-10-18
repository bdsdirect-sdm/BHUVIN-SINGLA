import {validationResult} from "express-validator"
import {Request,Response,NextFunction} from "express"

export const validateUser = (req:Request, res:Response, next:NextFunction) =>{
    const errors = validationResult(req);
    const err = errors.array();
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:err});
    }
    next();
};
