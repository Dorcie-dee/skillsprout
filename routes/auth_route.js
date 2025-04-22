import { Router } from "express";
import { forgotPassword, loginUser, logoutUser, resetPassword, signupUser } from "../controllers/auth_controller.js";


const authRouter = Router();

authRouter.post('/signup', signupUser);

authRouter.post('/login', loginUser);

authRouter.post('/logout', logoutUser);


//password reseting

authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/reset-password/:token', resetPassword);


export default authRouter
