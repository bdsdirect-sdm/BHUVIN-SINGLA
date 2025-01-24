import { Router } from "express";
import userAuthMiddleware from "../middlewares/userAuth";
import { adminLogin, adminLogout, adminregister, editUserstatus, editWavestatus, getAllUsers, getAllwaves, getCounts, updatePersonalUser, updateBasicUser, deleteWave, deleteUser } from "../controllers/adminController";


const adminRouter = Router();

adminRouter.post('/adminauth', adminLogin);
adminRouter.post('/adminregister', adminregister);

adminRouter.put('/adminlogout', userAuthMiddleware, adminLogout);
adminRouter.put('/editwavestatus', userAuthMiddleware, editWavestatus);
adminRouter.put('/edituserstatus', userAuthMiddleware, editUserstatus);
adminRouter.put('/editadminbasicuser', userAuthMiddleware, updateBasicUser);
adminRouter.put('/editadminpersonaluser', userAuthMiddleware, updatePersonalUser);

adminRouter.get('/allusers', userAuthMiddleware, getAllUsers);
adminRouter.get('/allwaves', userAuthMiddleware, getAllwaves);
adminRouter.get('/getdata', userAuthMiddleware, getCounts);

adminRouter.delete('/deletewave/:UUID', userAuthMiddleware, deleteWave);
adminRouter.delete('/deleteuser/:UUID', userAuthMiddleware, deleteUser);

export default adminRouter;