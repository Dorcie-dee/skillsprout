import { BlacklistModel, UserModel } from "../models/auth_model.js";
import { loginUserValidator, signupUserValidator, updateUserValidator } from "../validators/auth_validator.js"

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'




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