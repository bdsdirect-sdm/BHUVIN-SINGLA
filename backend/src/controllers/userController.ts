//userController.ts

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
import Comment from "../models/Comment";
import { uploadWave } from "../utils/uploadWave"; // Adjust import if using another uploader
import Admin from "../models/Admin";

const SECRET_KEY: any = Local.SECRET_KEY

export const userList = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid } });
        const friends = await Friend.findAll(
            {
                where: {
                    [Op.or]: [
                        { user_1_Id: uuid },
                        { user_2_Id: uuid }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'friend_1',
                    },
                    {
                        model: User,
                        as: 'friend_2',
                    }
                ]
            }
        );

        return res.status(200).json({ "friends": friends, "user": user });
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' });
    }
}

export const userLogin = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body.formData;
        const { data } = req.body;
        console.log(data);
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            res.status(401).json({ 'message': 'Invalid email' });
        }
        else {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                res.status(401).json({ 'message': 'Wrong password' });
            }
            else {
                // const token = jwt.sign({uuid: user.uuid}, SECRET_KEY, {expiresIn: '1h'});
                if (data) {
                    const invite: any = jwt.verify(data, SECRET_KEY, (err: any, info: any) => {
                        if (err) {
                            return 0;
                        }
                        return info;
                    });
                    if (invite) {
                        const friendinfo = invite.split('_');
                        console.log("friendinfo----->", friendinfo);
                        const friend = await Friend.create({
                            user_1_Id: user.uuid,
                            user_2_Id: friendinfo[1],
                        });
                        console.log("Friend", friend);
                        if (friend) {
                            const request = await Request.findOne({ where: { url: data } });
                            console.log("request----->", request)
                            if (request) {
                                await request.update({
                                    request_status: 1
                                });
                            }
                        }
                    }
                }
                const token = jwt.sign({ uuid: user.uuid }, SECRET_KEY);
                res.status(200).json({ 'message': 'Login successful', "token": token, "user": user });
            }
        }
    }
    catch (err) {
        res.status(500).json({ 'message': 'Something went wrong' })
    }
}

export const Register = async (req: any, res: any) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body.formData;
        const { data } = req.body;
        console.log("data--->", data);

        const isExist = await User.findOne({ where: { email: email } });
        if (isExist) {
            return res.status(400).json({ 'message': 'User already exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            phone
        });

        if (data) {
            const invite: any = jwt.verify(data, SECRET_KEY, (err: any, info: any) => {
                if (err) {
                    return 0;
                }
                return info;
            });

            if (invite) {
                const friendinfo = invite.split('_');
                console.log("friendinfo----->", friendinfo);
                const friend = await Friend.create({
                    user_1_Id: user.uuid,
                    user_2_Id: friendinfo[3]
                })
                console.log("friend----->", friend);
                if (friend) {
                    const request = await Request.findOne({ where: { url: data } });
                    console.log("huhu===>", request)
                    if (request) {
                        await request.update({
                            request_status: 1,
                            email: email,
                            sent_to_mail: email
                        })
                    }
                }
            }
        }

        return res.status(200).json({ 'message': 'User created successfully' });
    }
    catch (err) {
        return res.status(500).json({ 'message': 'Something went wrong, Please try after sometime' })
    }
}

// export const updateUser = async (req: any, res: Response) => {
//     try {
//         const { uuid } = req.user;
//         const { firstname, lastname, email, social_security, phone, address, address_one,
//             address_two, city, state, zip_code, dob, gender, martial_status, social, kids } = req.body;

//         const user = await User.findByPk(uuid);

//         const updatedUser = await user?.update({
//             firstname, lastname, email, social_security, phone, address, address_one,
//             address_two, city, state, zip_code, dob, gender, martial_status, social, kids
//         });
//         res.status(200).json({ "message": "User updated successfully" });
//     }
//     catch (err) {
//         res.status(500).json({ 'message': 'Something went wrong' });
//     }
// }

// export const updateProfilePhoto = async (req: any, res: Response) => {
//     try {
//         const { uuid } = req.user;


//     }
//     catch (err) {
//         res.status(500).json({ 'message': 'Something went wrong' });
//     }
// }

export const addorUpdatePreference = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const { language, breakfast, lunch, dinner, wake_time, bed_time, weight_in, height_in, blood_glucose_in,
            blood_pressure_in, cholesterol_in, distance_in, system_email, member_services_email, sms,
            phone_call, post } = req.body;

        const preference = await Preference.findOne({ where: { userId: uuid } });

        if (preference) {
            await preference.update({
                language, breakfast, lunch, dinner, wake_time, bed_time, weight_in, height_in, blood_glucose_in,
                blood_pressure_in, cholesterol_in, distance_in, system_email, member_services_email, sms,
                phone_call, post, userId: uuid
            })
        }
        else {
            await Preference.create({
                language, breakfast, lunch, dinner, wake_time, bed_time, weight_in, height_in, blood_glucose_in,
                blood_pressure_in, cholesterol_in, distance_in, system_email, member_services_email, sms,
                phone_call, post, userId: uuid
            })
        }
        res.status(200).json({ "message": "Preference updated Successfully" });
    }
    catch (err) {
        res.status(500).json({ 'message': `Something went wrong ${err}` })
    }
}

export const updateUserPassword = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const { prevPass, newPass } = req.body.data;
        const user: any = await User.findByPk(uuid);
        const isMatched = await bcrypt.compare(prevPass, user.password);
        if (isMatched) {
            const hashedPassword = await bcrypt.hash(newPass, 10);
            await user.update({ password: hashedPassword });
            res.status(200).json({ "message": "Password updated Successfully" });
        } else {
            res.status(401).json({ "message": "Current Password isn't matched" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

export const inviteFriend = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const friends = req.body;
        const user: any = await User.findByPk(uuid);
        console.log("====>", friends);
        await friends.map(async (friend: any) => {

            let existedUser = await User.findOne({ where: { email: friend.email } });
            console.log(friend);
            const firstname = friend.name.split(' ')[0];
            const lastname = friend.name.split(' ')[1];
            if (existedUser) {
                const alreadyfriend = await Friend.findOne({
                    where: {
                        [Op.or]: [
                            {
                                [Op.and]: [
                                    { user_1_Id: uuid },
                                    { user_2_Id: existedUser.uuid }
                                ]
                            },
                            {
                                [Op.and]: [
                                    { user_1_Id: existedUser.uuid },
                                    { user_2_Id: uuid }
                                ]
                            }
                        ]
                    }
                });
                if (alreadyfriend) {
                    return res.status(400).json({ "message": ` ${existedUser.firstname} ${existedUser.lastname} is already your friend` });
                }
                var template: string = loginTemplate(user.firstname, user.lastname, existedUser.email, friend.message, uuid);
                const temp = template.split(' ');
                const link = temp[temp.length - 2];
                const b = link.split('/');
                const data = b[b.length - 1];

                let request = await Request.create({
                    firstname,
                    lastname,
                    email: friend.email,
                    message: friend.message,
                    url: data,
                    sent_by: uuid,
                    sent_to: existedUser.uuid
                });
            } else {
                var template: string = signupTemplate(user.firstname, user.lastname, friend.email, firstname, lastname, user.uuid, friend.message);
                const temp = template.split(' ');
                const link = temp[temp.length - 2];
                const b = link.split('/');
                const data = b[b.length - 1];


                let request = await Request.create({
                    firstname,
                    lastname,
                    email: friend.email,
                    message: friend.message,
                    url: data,
                    sent_by: uuid,
                    sent_to_mail: friend.email
                });
            }
            sendInvitation(friend.email, template);
        });

        res.status(200).json({ "message": "Invitation sent Successfully" });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}

export const getUserPreference = async (req: any, res: Response) => {
    try {
        const { uuid } = req.user;
        const preference = await Preference.findOne({ where: { userId: uuid } });
        if (preference) {
            res.status(200).json({ "preference": preference });
        } else {
            res.status(200).json({ "message": "No preference found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}

export const createWave = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        console.log("------>", uuid)
        const { text } = req.body;
        const photo = req.file.path;
        console.log("======>", photo);
        const wave = await Wave.create({
            userId: uuid,
            text: text,
            photo: photo
        });
        if (wave) {
            return res.status(200).json({ "message": "Wave Created Successfully" });
        } else {
            return res.status(500).json({ "message": "Something went wrong" });
        }
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

export const getMyWaves = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const waves = await Wave.findAll({ where: { userId: uuid } });
        if (waves) {
            return res.status(200).json(waves);
        }
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

export const getLatestWaves = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const waves = await Wave.findAll({
            where: {
                userId: {
                    [Op.ne]: uuid
                }
            },
            order: [['createdAt', 'DESC']],
            limit: 6,
            include: [
                {
                    model: User,
                    as: 'user_wave'
                },
                // {
                //     model: Comment,
                //     as: 'wave_comment',
                //     include:[
                //         {
                //             model: User,
                //             as: 'user_comment'
                //         }
                //     ]
                // }
            ]
        });
        if (waves) {
            return res.status(200).json({ "message": "Waves are fetched", "waves": waves });
        }
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

export const getComments = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const { waveId } = req.body;
        const comments = await Comment.findAll({
            where: {
                waveId: {
                    [Op.eq]: waveId
                }
            },
            include: [
                {
                    model: User,
                    as: 'user_comment'
                }
            ]
        });
        return res.json({ "comments": comments });
    }
    catch (err) {

    }
}

export const getRequests = async (req: any, res: any) => {
    try {
        const { uuid } = req.user;
        const requests = await Request.findAll({ where: { sent_by: uuid } });
        return res.status(200).json({ message: "Requests are fetched", requests });
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

export const addComment = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const { comment, waveId } = req.body.data;
        const newcomment = await Comment.create({
            comment,
            waveId,
            userId: uuid
        });
        if (newcomment) {
            res.status(200).json({ "message": "Comment added successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

export const updateComment = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const { comment, commentId } = req.body;
        const updatedComment = await Comment.update({ comment }, { where: { uuid: commentId } });
        if (updatedComment) {
            res.status(200).json({ "message": "Comment updated successfully" });
        }
    }
    catch (err) {
        return res.status(500).json({ "message": `Something went wrong ${err}` });
    }
}

export const deleteComment = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const { commentId } = req.params;
        await Comment.update({ status: false }, { where: { uuid: commentId } });

        return res.status(200).json({ "message": "Comment deleted successfully" });
    }
    catch (err) {

    }
}

export const getProfileData = async (req: any, res: Response): Promise<any> => {
    try {
        console.log('====================================');
        console.log("flkdjfl fldjfkldjklfj");
        console.log('====================================');
        const { uuid } = req.user;
        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(user, "UUUUUUUu")
        return res.status(200).json({ message: "User found successfully", user });

    } catch (err) {
        console.error("Error fetching profile data:", err);
        return res.status(500).json({ message: "Something went wrong", error: err });
    }
};

export const addOrUpdateUser = async (req: any, res: any): Promise<any> => {
    try {
        const { uuid } = req.user;
        console.log("qwer", uuid);

        const {
            firstname,
            lastname,
            email,
            phone,
            address_one,
            address_two,
            address,
            city,
            state,
            zip_code,
            dob,
            gender,
            martial_status,
            social_security,
            social,
            kids
        } = req.body;

        // Find the existing user by uuid
        const user = await User.findOne({ where: { uuid } });

        if (user) {
            // If user exists, update their details
            await user.update({
                firstname,
                lastname,
                email,
                phone,
                address_one,
                address_two,
                address,
                city,
                state,
                zip_code,
                dob,
                gender,
                martial_status,
                social_security,
                social,
                kids
            });
            return res.status(200).json({ message: "Profile updated successfully", user });
        }

        else {
            // If user does not exist, create a new user
            const newUser = await User.create({
                uuid,
                firstname,
                lastname,
                email,
                phone,
                address_one,
                address_two,
                address,
                city,
                state,
                zip_code,
                dob,
                gender,
                martial_status,
                social_security,
                social,
                kids
            });

            return res.status(201).json({ message: "Profile created successfully", user: newUser });
        }
    }
    catch (err) {
        console.error("Error updating or creating profile:", err);
        return res.status(500).json({ message: "Something went wrong", error: err });
    }
};

export const updateProfilePhoto = async (req: any, res: Response): Promise<any> => {
    try {
        const { uuid } = req.user;
        const photoPath = req.file?.path;

        if (!photoPath) {
            return res.status(400).json({ message: "No photo uploaded" });
        }

        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update({ profilePhoto: photoPath });

        return res.status(200).json({ message: "Profile photo updated successfully", photoPath });
    } catch (err) {
        console.error("Error updating profile photo:", err);
        return res.status(500).json({ message: "Something went wrong", error: err });
    }
};

export const registerAdmin = async (req: any, res: any) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        console.log("XXXXXXXxx", req.body);

        // Check if the admin already exists
        const isExist = await Admin.findOne({ where: { email } });
        if (isExist) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Create a new admin
        const admin = await Admin.create({
            firstname,
            lastname,
            email,
            password
        });

        return res.status(201).json({
            message: "Admin created successfully",
            admin,
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

export const loginAdmin = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        console.log("----------------------")
        console.log("email", email, "PASSWORD", password);
        console.log("---------------------------")

        const admin = await Admin.findOne({ where: { email: email } });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        // Compare the provided password with the stored hashed password
        // const isValid = bcrypt.compare(password, Admin.password);
        // if (!isValid) {
        //     return res.status(401).json({ message: 'Wrong password' });
        // }

        // Generate JWT token for the admin
        console.log("tarun", admin)
        const token = jwt.sign({ uuid: admin.uuid }, SECRET_KEY, { expiresIn: '1h' });

        // Send the response with success message, token, and admin info
        return res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                uuid: admin.uuid,
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
                password: admin.password,
                status: admin.status,

            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong, please try again later' });
    }
};
