import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import UserDetail from "../models/userDetail"
import Hobbies from "../models/hobbiesModel"
import { generateRandomCode } from "../utilities/generateRandomCode"
import { sendMail } from "../config/mailConnect"
import bcrypt from "bcrypt"
import { passwordToHassed } from "../utilities/hassedPassword"
import { welcomeEmail } from "../emailTemplates/welcomeEmail"

interface payloadInterface {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNo: string,
    gender: string,
    user_type: string,
    profile_image: string,
    agency?: string,
    resume?: string,
    isActive: boolean
}


export const userSignup = async (req: any, res: Response) => {
    try {

        const { firstName, lastName, email, phoneNo, gender, user_type, hobbies, isActive = true } = req.body;

        const hobbiArray = (hobbies).split(",");


        const password = generateRandomCode(8);

        const hashedPassword = await passwordToHassed(password);

        const { profile_image } = req.files;


        let payload: payloadInterface = { firstName, lastName, email, phoneNo, gender, user_type, password: hashedPassword, isActive, profile_image: profile_image?.[0].path };

        if (user_type === "Job_Seeker") {
            const { agency } = req.body;
            payload.agency = agency;
            const { resume } = req?.files;
            const resumePath = resume?.[0].path;
            payload.resume = resumePath
        }

        const existUser = await UserDetail.findOne({ where: { email: email } });

        if (existUser) {
            res.status(409).json({
                message: "User Already exist",
                success: false
            })
            return;
        }

        const userDetail: any = await UserDetail.create(payload as any);

        const insertAllHobbies: any = hobbiArray?.map((hobbi: string) => Hobbies.create({
            hobbi,
            userId: userDetail?.id
        }))
        const hobbiDetail: any = await Promise.all(insertAllHobbies);

        if (!userDetail || !hobbiDetail) {
            res.status(500).json({
                message: "Failed to create user",
                success: false
            })
        }


        await sendMail(email, "Welcome Message", welcomeEmail(user_type, password, firstName + " " + lastName))


        res.status(200).json({
            success: true,
            message: "Successfully created user",
            userDetail,
            hobbiDetail
        })

    } catch (error) {
        res.status(500).json({
            message: "problem in creating user profile",
            success: false
        })
        console.log(error)
    }
}

export const getAllAgencies = async (req: any, res: Response) => {
    try {
        const allAgencies = await UserDetail.findAll({
            where: {
                user_type: "Agency",
                isActive: true
            }
        })

        res.status(200).json({
            success: true,
            data: allAgencies
        })
        return;
    } catch (error: any) {
        res.status(500).json({
            error: error.message,
            message: "problem in getting all agencies",
            success: false
        })
    }
}

// controllers/userController.ts
export const respondToSeeker = async (req: any, res: Response) => {
    const { seekerId, action } = req.body;

    try {
        // Logic to update the seeker's status based on action
        if (action === 'accept') {
            // Update seeker status to accepted in the database
            await UserDetail.update({ status: 'accepted' }, { where: { id: seekerId } });
            res.status(200).json({ message: 'Seeker accepted successfully' });
        } else if (action === 'decline') {
            // Update seeker status to declined in the database
            await UserDetail.update({ status: 'declined' }, { where: { id: seekerId } });
            res.status(200).json({ message: 'Seeker declined successfully' });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error responding to seeker', error });
    }
};


// to change status 
// export const changeSeekerStatus = async (req: any, res: any) => {
//     const { seekerId, status } = req.body;

//     try {
//         if (status !== 'accepted' && status !== 'declined') {
//             return res.status(400).json({ message: 'Invalid status value' });
//         }

//         await UserDetail.update({ status }, { where: { id: seekerId } });

//         res.status(200).json({
//             success: true,
//             message: `Seeker status updated to ${status}`,
//         });
//     } catch (error: any) {
//         res.status(500).json({
//             success: false,
//             message: 'Error updating seeker status',
//             error: error.message,
//         });
//     }
// };



export const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(404).json({
                message: "Details is incomplete",
                success: false
            })
            return;
        }

        const user: any = await UserDetail.findOne({
            where: {
                email: email,
            }
        })


        if (!user) {
            res.status(404).json({
                message: "User is not exsist please Register",
                success: false
            })
            return;
        }

        if (!await bcrypt.compare(password, user?.password)) {
            res.status(409).json({
                success: false,
                message: "password is incorrect"
            })
            return;
        }

        const payload = {
            user
        }

        const token = await jwt.sign(payload, process.env.SECREAT_KEY as string, {
            expiresIn: "1h"
        })

        user.password = undefined;

        res.status(200).json({
            message: "token generate succesfully",
            token,
            user,
        })

    } catch (error) {
        res.status(500).json({
            message: error

        })
        console.log(error)
    }

}

export const updatePassword = async (req: any, res: Response) => {
    try {
        const { email } = req.user;
        const { password } = req.body;

        const hashedPassword = await passwordToHassed(password);

        const result: any = await UserDetail.findOne({
            where: { email: email }
        })

        result.password = hashedPassword;
        result.isActive = true;
        await result?.save();

        res.status(200).json({
            success: true,
            message: "password updated succesfully"
        })

    } catch (error) {
        res.status(500).json({
            message: error,
            success: false,

        })
        console.log(error)
    }
}

export const getMyAgency = async (req: any, res: Response) => {
    try {
        const agencyName = req?.user?.agency;
        const agency = await UserDetail.findOne({
            where: {
                firstName: agencyName
            }
        })
        res.status(200).json({
            success: true,
            agency: agency
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

export const getAllSeekers = async (req: any, res: Response) => {
    try {
        const agencyName = req?.user?.firstName;
        const sekeers = await UserDetail.findAll({
            where: {
                agency: agencyName
            }
        })
        res.status(200).json({
            success: true,
            sekeers: sekeers
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}