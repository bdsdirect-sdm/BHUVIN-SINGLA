//userController.ts
import { Local } from "../environment/env";
import Address from "../models/Address";
import Patient from "../models/Patient";
import sendOTP from "../utils/mailer";
import User from "../models/User";
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from 'bcrypt';

const Security_Key: any = Local.SECRET_KEY;

const otpGenerator = () => {
    return String(Math.round(Math.random() * 10000000000)).slice(0, 6);
};

// Register User
export const registerUser = async (req: any, res: Response) => {
    try {
        const { firstname, lastname, doctype, email, password } = req.body;
        const isExist = await User.findOne({ where: { email: email } });
        if (isExist) {
            res.status(401).json({ "message": "User already Exist" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ firstname, lastname, doctype, email, password: hashedPassword });
            if (user) {
                const OTP = otpGenerator();
                sendOTP(user.email, OTP);
                res.status(201).json({ "OTP": OTP, "message": "Data Saved Successfully" });
            } else {
                res.status(403).json({ "message": "Something Went Wrong" });
            }
        }
    } catch (err) {
        res.status(500).json({ "message": err });
    }
};

// Verify User
export const verifyUser = async (req: any, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            user.is_verified = true;
            await user.save();
            res.status(200).json({ "message": "User Verified Successfully" });
        } else {
            res.status(403).json({ "message": "Something Went Wrong" });
        }
    } catch (err) {
        res.status(500).json({ "message": err });
    }
};

// Login User
export const loginUser = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                if (user.is_verified) {
                    const token = jwt.sign({ uuid: user.uuid }, Security_Key);
                    res.status(200).json({ "token": token, "user": user, "message": "Login Successful" });
                } else {
                    const OTP = otpGenerator();
                    sendOTP(user.email, OTP);
                    res.status(200).json({ "user": user, "OTP": OTP, "message": "OTP sent Successfully" });
                }
            } else {
                res.status(403).json({ "message": "Invalid Password" });
            }
        } else {
            res.status(403).json({ "message": "User doesn't Exist" });
        }
    } catch (err) {
        res.status(500).json({ "message": err });
    }
};

// Get User Data (Dynamic)
export const getUser = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user; // Get the user UUID from the token

        // Fetch the user along with the associated addresses (hasMany)
        const user = await User.findOne({
            where: { uuid },
            include: [{
                model: Address, // Include the Address model (a list of addresses)
                required: false, // If no address exists, the query will still return the user
            }],
        });

        if (user) {
            // Additional logic like counting referrals
            const referCount = await Patient.count({ where: { referedto: uuid } });
            const referCompleted = await Patient.count({ where: { referedto: uuid, referalstatus: 1 } });

            let docCount;
            if (user.doctype === 1) {
                docCount = await User.count({ where: { is_verified: 1 } });
            } else {
                docCount = await User.count({ where: { is_verified: 1, doctype: 1 } });
            }

            res.status(200).json({
                user: user,
                message: "User Found",
                docCount,
                referCount,
                referCompleted,
            });
        } else {
            res.status(404).json({ message: "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ message: `Error: ${err}` });
    }
};

export const getDoctorAddresses = async (req: any, res: any) => {
    try {
        const { uuid } = req.user; // Get the logged-in user's UUID from the token

        // Find the logged-in doctor (user)
        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // Fetch all addresses for the logged-in user (doctor)
        const addresses = await Address.findAll({ where: { user_uuid: uuid } });

        if (addresses.length > 0) {
            return res.status(200).json({ addresses, message: "Doctor's addresses found" });
        } else {
            return res.status(404).json({ message: "No addresses found for this doctor" });
        }
    } catch (err) {
        return res.status(500).json({ message: `Error: ${err}` });
    }
};

// Get Doctor List (Dynamic)
export const getDocList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });

        let docList;
        if (user?.doctype == 1) {
            docList = await User.findAll({ where: { uuid: { [Op.ne]: uuid } }, include: Address });
        } else {
            docList = await User.findAll({ where: { doctype: 1, uuid: { [Op.ne]: uuid } }, include: Address });
        }

        if (docList) {
            res.status(200).json({ "docList": docList, "message": "Doctors List Found" });
        } else {
            res.status(404).json({ "message": "MD List Not Found" });
        }
    } catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
};

// Get Patient List
export const getPatientList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });

        if (user) {
            const patientList: any = await Patient.findAll({ where: { [Op.or]: [{ referedby: uuid }, { referedto: uuid }] } });

            if (patientList) {
                const plist: any[] = [];
                for (const patient of patientList) {
                    const [referedtoUser, referedbyUser, address] = await Promise.all([
                        User.findOne({ where: { uuid: patient.referedto } }),
                        User.findOne({ where: { uuid: patient.referedby } }),
                        Address.findOne({ where: { uuid: patient.address } }),
                    ]);

                    const newPatientList: any = {
                        uuid: patient.uuid,
                        firstname: patient.firstname,
                        lastname: patient.lastname,
                        disease: patient.disease,
                        referalstatus: patient.referalstatus,
                        referback: patient.referback,
                        createdAt: patient.createdAt,
                        updatedAt: patient.updatedAt,
                        referedto: referedtoUser,
                        referedby: referedbyUser,
                        address: address,
                    };

                    plist.push(newPatientList);
                }

                res.status(200).json({ "patientList": plist, "message": "Patient List Found" });
            } else {
                res.status(404).json({ "message": "Patient List Not Found" });
            }
        } else {
            res.status(404).json({ "message": "User Not Found" });
        }
    } catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
};

// Add Patient
export const addPatient = async (req: any, res: Response) => {
    try {
        const { referedby, referedto, firstname, lastname, disease, address, referalstatus } = req.body;
        const patient = await Patient.create({ referedby, referedto, firstname, lastname, disease, address, referalstatus });
        res.status(201).json({ "message": "Patient Added Successfully", patient });
    } catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
};

// Add Address
export const addAddress = async (req: any, res: Response) => {
    try {
        const { addressLine, city, state, country } = req.body;
        const { uuid } = req.user; // Get user UUID from token

        // Create or update address for the user
        const [address, created] = await Address.upsert(
            {
                addressLine,
                city,
                state,
                country,
                user_uuid: uuid, // Associate address with the current user
            },
            { returning: true }
        );

        if (created) {
            res.status(201).json({ message: "Address Added Successfully", address });
        } else {
            res.status(200).json({ message: "Address Updated Successfully", address });
        }
    } catch (err) {
        res.status(500).json({ message: `Error: ${err}` });
    }
};

// Change Password
export const changePassword = async (req: any, res: any) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { uuid } = req.user; // Get user UUID from token

        // Find user by UUID
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: "Current password is incorrect" });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};


