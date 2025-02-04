//userRouter.ts

import { Router } from "express";
import {
    userLogin, userList, Register, addorUpdatePreference, getUserPreference,
    inviteFriend, updateProfilePhoto, addOrUpdateUser, updateUserPassword,
    createWave,
    getMyWaves,
    getRequests,
    getLatestWaves,
    getComments,
    addComment,
    deleteComment,
    updateComment,
    getProfileData,
    registerAdmin,
    loginAdmin,
    createPaymentIntent
    // addProfile
} from "../controllers/userController";


import userAuthMiddleware from "../middlewares/userAuth";
import { uploadWave } from "../utils/uploadWave";
import { uploadProfile } from "../utils/uploadProfilePhoto";

const router = Router();

router.post('/login', userLogin);
router.post('/signup', Register);
router.post('/addwave', userAuthMiddleware, uploadWave.single('photo'), createWave);
router.post('/invite-friend', userAuthMiddleware, inviteFriend);
router.post('/updatepreference', userAuthMiddleware, addorUpdatePreference);
router.post('/addcomment', userAuthMiddleware, addComment);
router.post('/updateprofilephoto', userAuthMiddleware, uploadProfile.single('profile_photo'), updateProfilePhoto);
router.post('/updateuserprofile', userAuthMiddleware, addOrUpdateUser);
router.post('/admin-register', registerAdmin);
router.post('/admin-login', loginAdmin);

router.post('/create-payment-intent', createPaymentIntent);

router.get('/getmywave', userAuthMiddleware, getMyWaves);
router.get('/getrequests', userAuthMiddleware, getRequests);
router.get('/getlatestwaves', userAuthMiddleware, getLatestWaves);
router.get('/getcomments', userAuthMiddleware, getComments);
router.get('/getpreference', userAuthMiddleware, getUserPreference);
router.get('/getfriendlist', userAuthMiddleware, userList);
router.get('/getprofiledata', userAuthMiddleware, getProfileData);

router.put('/updatepassword', userAuthMiddleware, updateUserPassword);
router.put('/editcomment', userAuthMiddleware, updateComment);
router.put('/deletecomment/:commentId', userAuthMiddleware, deleteComment);

export default router;