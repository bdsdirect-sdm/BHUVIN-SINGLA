import { NextFunction, Request, Response } from "express";
import multer from "multer";
import fs from "node:fs";
import {v4 as uuidv4} from "uuid"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "upload"
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
            
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const file_Name = uuidv4() + "." + file.originalname;
        cb(null, file_Name );
    }
})


const imagaeuploader = multer({
    storage:storage,
    fileFilter:(req, file, cb) =>{
        if(file.fieldname == "profile_image"){
            if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
                cb(null , true);
            }
            else{
                cb(new Error("Only png and jpeg files are allowed"))
            }
        }
        else if(file.fieldname == "resume"){
            if(file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
                cb(null , true);
            }
            else{
                cb(new Error("only pdf and docs files are allowed"));
            }
        }
        else{
            cb(null, true)
        }
    }
})

export default  imagaeuploader;