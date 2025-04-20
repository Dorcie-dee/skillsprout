import Joi from "joi";

export const signupUserValidator = Joi.object({
  fullname: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string()
  .min(8)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
  .message("Password must include uppercase, lowercase, and a number")
  .required(),
  role: Joi.string().valid("student", "tutor", "admin").default("student"), 
});


export const loginUserValidator = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});


export const updateUserValidator = Joi.object({
  fullname: Joi.string().trim().optional(),
  age: Joi.string().trim().optional(),
  profilePicture: Joi.string().optional()
});                                                                                                                                                                                                             