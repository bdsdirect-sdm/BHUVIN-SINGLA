// userRouter.ts
import { Router } from "express";
import { registerUser, loginUser, verifyUser, getUser, getDocList, getPatientList, addPatient, addAddress, changePassword, getDoctorAddresses, updateUser, addStaff, getStaffList, getRooms, getAddresses, deleteAddress } from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import signupValidation from "../middlewares/formValidation.ts/signupValidation";
import loginValidation from "../middlewares/formValidation.ts/loginValidation";

const router = Router();

router.post("/register", signupValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.put("/verify", verifyUser);
router.get('/user', userAuthMiddleware, getUser);
router.get('/doc-list', userAuthMiddleware, getDocList);
router.get('/patient-list', userAuthMiddleware, getPatientList);
router.post('/add-patient', userAuthMiddleware, addPatient);
router.post('/add-address', userAuthMiddleware, addAddress);
router.post('/update-user', userAuthMiddleware, updateUser);
router.get('/doctor-addresses', userAuthMiddleware, getDoctorAddresses);
router.put('/change-password', userAuthMiddleware, changePassword);
router.post('/add-staff', userAuthMiddleware, addStaff);
router.get('/staff', userAuthMiddleware, getStaffList);
router.get('/profile', userAuthMiddleware, getAddresses);
router.get('/room-list', userAuthMiddleware, getRooms);

router.delete('/addresses/:id', userAuthMiddleware, deleteAddress);

export default router;
