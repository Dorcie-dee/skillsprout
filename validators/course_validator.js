import Joi from "joi";

// Course validation schema
export const courseValidator = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  subject: Joi.string().required().messages({
    "string.empty": "Subject is required",
    "any.required": "Subject is required",
  }),
  difficultyLevel: Joi.string()
    .valid("Easy", "Intermediate", "Advanced")
    .required()
    .messages({
      "any.only": "Difficulty must be Easy, Intermediate, or Advanced",
      "any.required": "Difficulty level is required",
    }),
  lesson_id: Joi.string().allow("").optional(),
  videoUrl: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Video URL must be a valid URL",
  }),
  quiz_id: Joi.string().allow("").optional(),
  offlineActivity_id: Joi.string().allow("").optional(),
  quiz: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).required(),
        answer: Joi.string().required(),
      })
    )
    .optional(),
});


export const replaceCourseValidator = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  subject: Joi.string().required().messages({
    "string.empty": "Subject is required",
    "any.required": "Subject is required",
  }),
  difficultyLevel: Joi.string()
    .valid("Easy", "Intermediate", "Advanced")
    .required()
    .messages({
      "any.only": "Difficulty must be Easy, Intermediate, or Advanced",
      "any.required": "Difficulty level is required",
    }),
  lesson_id: Joi.string().allow("").optional(),
  videoUrl: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Video URL must be a valid URL",
  }),
  quiz_id: Joi.string().allow("").optional(),
  offlineActivity_id: Joi.string().allow("").optional(),
  quiz: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).required(),
        answer: Joi.string().required(),
      })
    )
    .optional(),
});

// Validate course data
// export const validateCourse = (data) => {
//   const { error, value } = courseSchema.validate(data, { abortEarly: false });
//   if (error) {
//     const errors = error.details.map((detail) => detail.message);
//     throw new Error(errors.join(", "));
//   }
//   return value;
// };