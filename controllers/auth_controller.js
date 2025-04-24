import { BlacklistModel, UserModel } from "../models/auth_model.js";
import { loginUserValidator, signupUserValidator, updateUserValidator } from "../validators/auth_validator.js"
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { mailTransporter } from "../utils/mailing.js";
// import { registerUserMailTemplate } from "../utils/mailing.js";



//registering a user
export const signupUser = async (req, res) => {
  try {
    const { error, value } = signupUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.message })
    }

    const userExisting = await UserModel.findOne({
      $or: [
        {
          fullname: value.fullname
          // firstName: value.firstName,
          // lastName: value.lastName
        },
        { email: value.email }
      ]
    });
    if (userExisting) {
      return res.status(409).json('User already exists')
    }

    //generating profile pic using initials
    // const initials = `${value.firstName.charAt(0)}${value.lastName.charAt(0)}`.toUpperCase();
    const initials = `${value.fullname.charAt(0)}${value.fullname.charAt(1)}`.toUpperCase();
    const profilePictureUrl = `https:ui-avatars.com/api/?name=${initials}&background=random`;

    //password hashing
    const hashPassword = await bcrypt.hash(value.password, 10);

    if (value.role !== 'student') {
      delete req.body.badges;
      delete req.body.progress;
    }
    

    //new user
    const incomingUser = await UserModel.create({
      ...value,
      password: hashPassword,
      profilePicture: profilePictureUrl
    });

    res.status(201).json({
      message: 'User registered successfully'
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};


//login
export const loginUser = async (req, res) => {
  try {
    const { error, value } = loginUserValidator.validate(req.body)
    if (error) {
      return res.status(422).json({ message: error.details[0].message })
    }
    //checking if user exist in my db
    const user = await UserModel.findOne({
      email: value.email
    });
    if (!user) {
      res.status(422).json("User not found")
    };

    //comparing password
    const isAMatch = await bcrypt.compare(value.password, user.password);
    if (!isAMatch) {
      return res.status(401).json('Invalid credentials');
    }

    //generating jwt token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        fullname: user.fullname,
        email: user.email,
        id: user._id,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }

}


//updateuserProfile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { error, value } = updateUserValidator.validate({
      ...req.body,
      profilePicture: req.file?.filename
    })

    if (error) {
      return res.status(422).json(error);
    }

    await UserModel.findByIdAndUpdate(req.auth.id, value);
    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    next(error);
  }
}


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //Checking if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user with that email found." });
    }

    //Generating reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    //Hashing token before storing in my DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //Saving token and expiry sent to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1200000; // 20 mins
    await user.save();

    //Sending email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // frontend URL

    const message = `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.fullname},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 20 minutes.</p>
    `;
  
    await mailTransporter.sendMail({
      from: `"SkillSprout" <${process.env.HOST_EMAIL}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: message
    });

    res.status(200).json({ message: "Password reset link sent!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset link.", error: err.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(422).json({ message: "Password must be at least 8 characters long." });
    }

    // Hashing the token received in URL
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Finding a user with this token and ensure it's not expired
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Hashing new password
    const hashedPassword = await bcrypt.hash(password, 10);

    //password updated
    user.password = hashedPassword;

    // Clearing reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Saving updated user
    await user.save();

    res.status(200).json({ message: "Password reset successful. Please log in." });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
};


//logout
export const logoutUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    //decode the token to get the expiry time
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    await BlacklistModel.create({ token, expiresAt });

    res.json({ message: 'User logged out successfully' });

  } catch (error) {
    next(error);
  }
}

