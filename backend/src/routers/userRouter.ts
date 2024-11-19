import { Router } from "express";
import {
    registerUser,
    loginUser,
    verifyUser,
    getUser,
    getDocList,
    getPatientList,
    addPatient,
    addAddress,
    changePassword,
    getDoctorAddresses,
    getAddress
} from "../controllers/userController";

import userAuthMiddleware from "../middlewares/userAuth";
import signupValidation from "../middlewares/formValidation.ts/signupValidation";
import loginValidation from "../middlewares/formValidation.ts/loginValidation";

const router = Router();

// User Authentication Routes
router.post("/register", signupValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.put("/verify", verifyUser);

// User Data Routes
router.get('/user', userAuthMiddleware, getUser);
router.put('/change-password', userAuthMiddleware, changePassword);

// Doctor & Patient Routes
router.get('/doc-list', userAuthMiddleware, getDocList);
router.get('/doctor-list', userAuthMiddleware, getDocList);  // For patients
router.get('/patient-list', userAuthMiddleware, getPatientList);
router.post('/add-patient', userAuthMiddleware, addPatient);

// Address Routes
router.get('/addresses/doctor', userAuthMiddleware, getDoctorAddresses);
// New route for doctor addresses
router.post('/addresses/add', userAuthMiddleware, addAddress);
// New route to add addresses
router.get('/profile', userAuthMiddleware, getAddress);


export default router;
