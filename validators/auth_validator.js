import Joi from "joi";

export const signupUserValidator = Joi.object({
  fullname: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");


export const loginUserValidator = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});


export const updateUserValidator = Joi.object({
  fullname: Joi.string().trim().optional(),
  profilePicture: Joi.string().optional()
});                                                                                                                                                                                                             