import { Router } from "express";
import { forgotPassword, loginUser, logoutUser, resetPassword, signupUser } from "../controllers/auth_controller.js";
import { protect } from "../middleware/auth_middleware.js";


const authRouter = Router();

authRouter.post('/signup', signupUser);

authRouter.post('/login', loginUser);

authRouter.post('/logout', logoutUser);


//password reseting
authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/reset-password/:token', resetPassword);


//secured route for user info
authRouter.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});


export default authRouter
