import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { Local } from "../environment/env";
import Preference from "../models/Preference";
import Wave from "../models/Wave";
import sendInvitation from "../utils/mailer";
import Request from "../models/Request";
import { loginTemplate } from "../mailTemplate/loginTemplate";
import { signupTemplate } from "../mailTemplate/signuptemplate";
import Friend from "../models/Friend";
import { Op } from "sequelize";
import Admin from "../models/Admin";

const SECRET_KEY: any = Local.SECRET_KEY;

export const adminLogin = async (req: any, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        if (admin.is_login) {
            return res.status(401).json({ message: "Admin is already logged in" });
        }
        await admin.update({ is_login: true })
        const token = jwt.sign({ uuid: admin.uuid }, SECRET_KEY);
        return res.status(200).json({ "token": token, "message": "Admin logged in successfully", "isAdmin": true, "admin": admin });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}

export const adminregister = async (req: any, res: Response): Promise<any> => {
    try {
        const { fullname, email, password, } = req.body;
        const firstname = fullname.split(" ")[0];
        const lastname = fullname.split(" ")[1];

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({ firstname, lastname, email, password: hashedPassword });

        return res.status(200).json({ "message": "user created successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}

export const adminLogout = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const admin = await Admin.findOne({ where: { uuid } });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        await admin.update({ is_login: false });
        return res.status(200).json({ "message": "Admin logged out successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}

export const editWavestatus = async (req: any, res: Response): Promise<any> => {
    try {
        const { UUID } = req.body;
        const wave: any = await Wave.findOne({ where: { UUID } });
        if (wave) {
            await wave.update({ status: wave.status ? false : true });
        };
        return res.status(200).json({ "message": "Status Updated" });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}

export const editUserstatus = async (req: any, res: Response): Promise<any> => {
    try {
        const { UUID } = req.body;
        const user: any = await User.findOne({ where: { UUID } });
        if (user) {
            await user.update({ status: user.status ? false : true });
        };
        return res.status(200).json({ "message": "Status Updated" });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}

// export const getAllUsers = async (req: any, res: any): Promise<any> => {
//     try {
//         const { search, userType } = req.query;
//         var users;
//         if (userType != 1) {

//             users = await User.findAll({
//                 where: {
//                     [Op.and]: [
//                         {
//                             [Op.or]: [
//                                 { firstname: { [Op.like]: `%${search}%` } },
//                                 { lastname: { [Op.like]: `%${search}%` } },
//                                 { email: { [Op.like]: `%${search}%` } },
//                             ]
//                         },
//                         { status: userType == 2 ? true : false }
//                     ]
//                 }
//             });
//         } else {
//             users = await User.findAll({
//                 where: {
//                     [Op.or]: [
//                         { firstname: { [Op.like]: `%${search}%` } },
//                         { lastname: { [Op.like]: `%${search}%` } },
//                         { email: { [Op.like]: `%${search}%` } },
//                     ]
//                 }
//             });
//         }
//         return res.status(200).json(users);
//     }
//     catch (err) {
//         return res.status(500).json({ message: `Internal Server Error ${err}` });
//     }
// }


export const getAllUsers = async (req: any, res: any): Promise<any> => {
    try {
        console.log("Search start");
        const { search, userType } = req.query;
        console.log(req.query.data, "");
        let users;

        // If the userType is not '1', filter by 'status' as well
        if (userType != 1) {
            users = await User.findAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { firstname: { [Op.like]: `%${search}%` } },
                                { lastname: { [Op.like]: `%${search}%` } },
                                { email: { [Op.like]: `%${search}%` } },
                            ]
                        }
                        ,
                        { status: userType == 2 ? true : false }
                    ]
                }
            });
        } else {
            users = await User.findAll({
                where: {
                    [Op.or]: [
                        { firstname: { [Op.like]: `%${search}%` } },
                        { lastname: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } },
                    ]
                }
            });
        }
        return res.status(200).json(users); // Return the users found
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` }); // Handle errors
    }
}


export const getAllwaves = async (req: any, res: Response): Promise<any> => {
    try {
        const { search } = req.query;
        const waves = await Wave.findAll({
            include: [
                {
                    model: User,
                    as: 'user_wave',
                    where: {
                        [Op.or]: [
                            { firstname: { [Op.like]: `%${search}%` } },
                            { lastname: { [Op.like]: `%${search}%` } }
                        ]
                    }
                }
            ]
        });
        return res.status(200).json(waves);
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}

export const getCounts = async (req: any, res: Response): Promise<any> => {
    try {
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { status: true } });
        const inactiveUsers = await User.count({ where: { status: false } });
        const totalWaves = await Wave.count();

        res.status(200).json({ "message": "Values Fetched", totalUsers, activeUsers, inactiveUsers, totalWaves });
    }
    catch (err) {
        return res.status(500).json({ message: `Internal Server Error ${err}` });
    }
}

export const updateBasicUser = async (req: any, res: Response) => {
    try {
        const { firstname, lastname, email, phone, address_one,
            address_two, city, state, zip_code } = req.body;
        const user = await User.findOne({ where: { email: email } });

        const updatedBasicUser = await user?.update({
            firstname,
            lastname,
            email,
            phone: phone ? phone : null,
            address_one,
            address_two: address_two ? address_two : null,
            city,
            state,
            zip_code
        });
        res.status(200).json({ "message": "Basic details updated successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}

export const updatePersonalUser = async (req: any, res: Response) => {
    try {
        const { dob, gender, martial_status, social, kids, social_security } = req.body.data;
        const userUUID = req.body.userUUID;
        const user = await User.findByPk(userUUID);

        const updatedPersonalUser = await user?.update({
            dob,
            gender,
            martial_status: martial_status ? martial_status : null,
            social: social ? social : null,
            kids: kids ? kids : null,
            social_security: social_security ? social_security : null
        });
        res.status(200).json({ "message": "Personal details updated successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}

export const deleteWave = async (req: any, res: Response) => {
    try {
        const { UUID } = req.params;
        const wave = await Wave.findByPk(UUID);
        await wave?.destroy();
        res.status(200).json({ "message": "Wave deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}
export const deleteUser = async (req: any, res: Response) => {
    try {
        const { UUID } = req.params;
        const user = await User.findByPk(UUID);
        await user?.destroy();
        res.status(200).json({ "message": "User deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}