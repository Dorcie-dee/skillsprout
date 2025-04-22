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
  category: Joi.string().required().valid('art', 'nature', 'language'),
  lesson_id: Joi.string().optional(),
  // videoUrl: Joi.string().uri().optional().messages({
  //   "string.uri": "Video URL must be a valid URL",
  // }),

  videoUrl: Joi.alternatives()
  .try(
    Joi.string().uri().optional(), // Single video URL (string)
    Joi.array().items(Joi.string().uri()).optional(), // Multiple video URLs (array of strings)
    Joi.array().items(Joi.object({
      fieldname: Joi.string().valid('videoUrl').required(), // Expect the field to be 'videoUrl' for file upload
      filename: Joi.string().required(), // File name from Cloudinary after upload
      url: Joi.string().uri().required() // URL of the uploaded file in Cloudinary
    })).optional() // If it's an array of file uploads
  )
  .messages({
    "string.uri": "Video URL must be a valid URL",
    "array.includes": "Video URLs must be an array of valid URLs",
  }),


  quiz_id: Joi.string().optional(),
  offlineActivity_id: Joi.string().optional(),
  
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


export const courseUpdateValidator = Joi.object({
  title: Joi.string(),
  subject: Joi.string(),
  difficultyLevel: Joi.string(),
  category: Joi.string(),
  lesson_id: Joi.string(),
  quiz_id: Joi.string(),
  offlineActivity_id: Joi.string(),
  quiz: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      options: Joi.array().items(Joi.string()).min(1).required(),
      answer: Joi.string().required()
    })
  ),
  videoUrl: Joi.any(),
  pictures: Joi.any()
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
  category: Joi.string().required().valid('art', 'nature', 'language'),
  lesson_id: Joi.string().optional(),
  // videoUrl: Joi.array().items(Joi.string().uri().messages({
    // "string.uri": "Video URL must be a valid URL",
  // })).optional(),
  
  videoUrl: Joi.alternatives()
  .try(
    Joi.string().uri().optional(), // Single video URL (string)
    Joi.array().items(Joi.string().uri()).optional(), // Multiple video URLs (array of strings)
    Joi.array().items(Joi.object({
      fieldname: Joi.string().valid('videoUrl').required(), // Expect the field to be 'videoUrl' for file upload
      filename: Joi.string().required(), // File name from Cloudinary after upload
      url: Joi.string().uri().required() // URL of the uploaded file in Cloudinary
    })).optional() // If it's an array of file uploads
  )
  .messages({
    "string.uri": "Video URL must be a valid URL",
    "array.includes": "Video URLs must be an array of valid URLs",
  }),


  pictures: Joi.array().items(Joi.string()).optional(),

  quiz_id: Joi.string().optional(),
  offlineActivity_id: Joi.string().optional(),
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