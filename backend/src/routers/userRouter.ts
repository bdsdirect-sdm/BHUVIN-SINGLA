import { Router } from "express";
import { userLogin, userList, Register, addorUpdatePreference,getUserPreference, 
    inviteFriend, updateProfilePhoto, updateUser, updateUserPassword, 
    createWave,
    getMyWaves,
    getRequests,
    getLatestWaves,
    getComments,
    addComment,
    deleteComment,
    updateComment} from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import { uploadWave } from "../utils/uploadWave";

const router = Router();

router.post('/login', userLogin);
router.post('/signup', Register);
router.post('/addwave', userAuthMiddleware, uploadWave.single('photo'), createWave );
router.post('/invite-friend', userAuthMiddleware, inviteFriend);
router.post('/updatepreference', userAuthMiddleware, addorUpdatePreference);
router.post('/addcomment', userAuthMiddleware, addComment);

router.get('/getmywave', userAuthMiddleware, getMyWaves);
router.get('/getrequests', userAuthMiddleware, getRequests);
router.get('/getlatestwaves', userAuthMiddleware, getLatestWaves);
router.get('/getcomments', userAuthMiddleware, getComments);
router.get('/getpreference', userAuthMiddleware, getUserPreference);
router.get('/getfriendlist', userAuthMiddleware, userList);

router.put('/updatepassword', userAuthMiddleware, updateUserPassword);
router.put('/editcomment', userAuthMiddleware, updateComment);
router.put('/deletecomment/:commentId', userAuthMiddleware, deleteComment);


// router.get("/user-list", userList);

export default router;