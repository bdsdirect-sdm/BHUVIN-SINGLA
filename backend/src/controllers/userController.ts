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
import Staff from "../models/Staff";
import Room from "../models/Room";
import Chat from "../models/Chat";
const Security_Key: any = Local.SECRET_KEY;

const otpGenerator = () => {
    return String(Math.round(Math.random() * 10000000000)).slice(0, 6);
};

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
        const { uuid } = req.user; // Extract the UUID from the authenticated user
        console.log("dwefef88888888888888888888888888888", uuid)
        // Find the logged-in user by UUID
        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the user's addresses
        const addresses = await Address.findAll({ where: { user_uuid: uuid } });

        return res.status(200).json({
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                gender: user.gender,
                phone: user.phone,
                email: user.email,
                doctype: user.doctype, // Assuming this field determines 'MD' or 'OD'
                address: addresses, // Add fetched addresses to the response
            },
            message: "Doctor profile and addresses fetched successfully",
        });
    } catch (err: any) {
        return res.status(500).json({ message: `Error: ${err.message}` });
    }
};

export const getAddresses = async (req: any, res: any) => {
    try {

        const { uuid } = req.user; // Extract the UUID from the authenticated user
        console.log("pakki baat", req.body);
        // Fetch the logged-in user
        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch addresses associated with the user
        const addresses = await Address.findAll({ where: { user: uuid } });

        // if (addresses.length === 0) {
        //     return res.status(200).json({ message: "No addresses found for this user" });
        // }

        res.status(200).json({
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                doctype: user.doctype, // Optional field to denote doctor type
                gender: user.gender
            },
            addresses, // List of user's addresses
            message: "User profile and addresses fetched successfully",
        });
    } catch (err: any) {
        res.status(500).json({ message: `Error: ${err.message}` });
    }
};

export const getDocList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid: uuid } });

        let docList;

        // Fetch both doctype 1 and doctype 2 doctors
        if (user?.doctype === 1 || user?.doctype === 2) {
            docList = await User.findAll({
                where: { uuid: { [Op.ne]: uuid } }, // Exclude the current user
                include: Address
            });
        } else {
            docList = await User.findAll({
                where: { doctype: 1, uuid: { [Op.ne]: uuid } }, // Only fetch doctype 1 doctors
                include: Address
            });
        }

        if (docList && docList.length > 0) {
            res.status(200).json({ "docList": docList, "message": "Doctors List Found" });
        } else {
            res.status(404).json({ "message": "MD List Not Found" });
        }
    } catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
};

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

                res.status(200).json({ "patientList": plist, "user": user, "message": "Patient List Found" });
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

export const addPatient = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const referedby = uuid;
        const { referedto, firstname, lastname, disease, address, referalstatus } = req.body;

        const patient = await Patient.create({
            referedby,
            referedto,
            firstname,
            lastname,
            disease,
            address,
            referalstatus,
        });

        res.status(201).json({ message: 'Patient Added Successfully', "patient": patient });
    } catch (err) {
        res.status(500).json({ message: `Error: ${err}` });
    }
};

export const addAddress = async (req: any, res: any) => {
    try {
        const { addressLine, city, street, state, country, district, phone, pincode } = req.body;
        const { uuid } = req.user; // Get user UUID from token

        // Create or update address for the user
        const [address, created] = await Address.upsert(
            {
                street,
                addressLine,
                city,
                state,
                country,
                district,
                phone,
                pincode,
                user: uuid,
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

export const updateUser = async (req: any, res: any) => {
    try {
        const { uuid } = req.user; // Get the user UUID from the token
        const {
            firstname,
            lastname,
            gender,
            phone,
            address, // Array of address objects
        } = req.body;

        // Update user details
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        await user.update({
            firstname,
            lastname,
            gender,
            phone,
        });

        // Update or create addresses
        if (address && Array.isArray(address)) {
            for (const addr of address) {
                const { id, street, district, city, state, pincode } = addr;

                if (id) {
                    // Update existing address
                    await Address.update(
                        { street, district, city, state, pincode },
                        { where: { id, userId: user.uuid } }
                    );
                } else {
                    // Create new address
                    await Address.create({
                        street,
                        district,
                        city,
                        state,
                        pincode,
                        userId: user.uuid,
                    });
                }
            }
        }

        res.status(200).json({ message: "User updated successfully", user });
    } catch (err: any) {
        res.status(500).json({ message: `Error: ${err.message}` });
    }
};

export const addStaff = async (req: any, res: any) => {
    try {
        const { staffName, email, contact, gender } = req.body;
        const { uuid } = req.user;

        // Check for duplicate email
        const existingStaff = await Staff.findOne({ where: { email } });
        if (existingStaff) {
            return res.status(400).json({ message: 'Staff with this email already exists' });
        }

        // Create a new staff record
        const staff = await Staff.create({
            staffName,
            email,
            contact,
            gender,
            user_id: uuid,
        });

        res.status(201).json({ message: 'Staff added successfully', staff });
    } catch (err: any) {
        res.status(500).json({ message: `Error: ${err.message}` });
    }
};

export const getRooms = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if (user) {
            const rooms = await Room.findAll({
                where: {
                    [Op.or]: [
                        { user_id_1: user.uuid },
                        { user_id_2: user.uuid }]
                },
                include: [
                    {
                        model: User,
                        as: 'doc1'
                    },
                    {
                        model: User,
                        as: 'doc2'
                    },
                    {
                        model: Patient,
                        as: 'patient'
                    }
                ]
            });
            res.status(200).json({ "room": rooms, "user": user });
        } else {
            res.status(404).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}

export const getStaffList = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const page = parseInt(req.query.page);
        // const limit = parseInt(req.query.limit);
        // const search = req.query.find;
        // const offset = limit * (page - 1)

        const user = await User.findByPk(uuid);
        if (user) {
            const staffs = await Staff.findAll({
                where: {
                    user_id: uuid
                },

            });

            const totalStaff = await Staff.count({ where: { user_id: uuid } });

            res.status(200).json({ "staff": staffs, "totalStaff": totalStaff });
        } else {
            res.status(404).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
}

// export const deleteAddress = async (req: any, res: Response) => {
//     try {
//         const { id } = req.params; // Get the address ID from the URL parameter
//         const { uuid } = req.user; // Extract user UUID from the authenticated token

//         // Find the address to verify it belongs to the logged-in user
//         const address = await Address.findOne({ where: { id, user: uuid } });

//         if (!address) {
//             return res.status(404).json({ message: "Address not found or unauthorized" });
//         }

//         // Delete the address
//         await address.destroy();

//         res.status(200).json({ message: "Address deleted successfully" });
//     } catch (err: any) {
//         res.status(500).json({ message: `Error: ${err.message}` });
//     }
// };

// export const deleteAddress = async (req: any, res: Response) => {
//     try {
//         const { id } = req.params; // Address ID from URL
//         const { uuid } = req.user; // User's UUID from the authenticated token

//         // Find the address and ensure it belongs to the authenticated user
//         const address = await Address.findOne({ where: { id, user: uuid } });

//         if (!address) {
//             return res.status(404).json({ message: "Address not found or unauthorized" });
//         }

//         // Delete the address
//         await address.destroy();

//         res.status(200).json({ message: "Address deleted successfully" });
//     } catch (error: any) {
//         res.status(500).json({ message: `Error: ${error.message}` });
//     }
// };

export const deleteAddress = async (req: any, res: any) => {
    try {
        console.log("data ==============>", req.body)
        const { id } = req.params; // Address UUID from the request parameters


        // Perform the deletion using Address.destroy
        const deletedCount = await Address.destroy({ where: { uuid: id } });
        console.log("<<<<<<<<<<<deletedCount>>>>>>>>>>>>>>>", deletedCount)

        // Check if any rows were affected
        if (deletedCount === 0) {
            return res.status(201).json({ message: "Address can't be deleted" });
        }

        // Respond with success if the deletion occurred
        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteStaff = async (req: any, res: any) => {
    try {
        console.log("Request to delete staff:", req.body);


        const { id } = req.params; // Staff UUID from the request parameters

        // Perform the deletion using Staff.destroy
        const deletedCount = await Staff.destroy({ where: { uuid: id } });
        console.log("Deleted staff count:", deletedCount);

        // Check if any rows were affected
        if (deletedCount === 0) {
            return res.status(404).json({ message: "Staff not found or could not be deleted" });
        }

        // Respond with success if the deletion occurred
        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




// export const deleteAddress = async (req: any, res: any) => {
//     try {
//         const { id } = req.params; // Address ID from the request parameters

//         // Check if the address exists and belongs to the authenticated user
//         const { uuid } = req.user; // Extract user UUID from the token
//         const deletedCount = await Address.destroy({
//             where: { uuid: id, userUuid: uuid }, // Match address by UUID and user UUID
//         });

//         // Check if any rows were deleted
//         if (deletedCount === 0) {
//             return res.status(404).json({ message: "Address not found or unauthorized" });
//         }

//         // Respond with success if the deletion occurred
//         res.status(200).json({ message: "Address deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting address:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
