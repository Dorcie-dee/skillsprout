import { Router } from "express";
import { loginUser, logoutUser, signupUser } from "../controllers/auth_controller.js";


const authRouter = Router();

authRouter.post('/signup', signupUser);

authRouter.post('/login', loginUser);

authRouter.post('/logout', logoutUser);

export default authRouter
