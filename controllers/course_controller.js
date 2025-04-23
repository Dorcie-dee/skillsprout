import { CourseModel } from "../models/course_model.js";
import { courseUpdateValidator, courseValidator, replaceCourseValidator } from "../validators/course_validator.js";
import { Types } from "mongoose";

// Create a new course
export const createCourse = async (req, res, next) => {
  try {
    const { error, value } = courseValidator.validate({
      ...req.body,
      videoUrl: req.files?.videoUrl ? req.files.videoUrl.map(file => file.filename) : [],
      // videoUrl: req.files?.map((file) => {
      //   return file.filename;
      // }),
      pictures: req.files?.pictures ? req.files.pictures.map(file => file.filename) : [],
      // pictures: req.files?.map((file) => {
      // return file.filename;
      // }),
      quiz: req.body.quiz ? JSON.parse(req.body.quiz) : [], // Parse the quiz JSON string into an array
    });
    console.log('Received quiz:', req.body.quiz);
    console.log('After JSON.parse:', JSON.parse(req.body.quiz));


    if (error) {
      return res.status(422).json(error);
    }

    const result = await CourseModel.create({
      ...value,
      userId: req.auth.id,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};


// Get a single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id).exec();
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    res.status(200).json({ data: course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//get a specicific userId courses
export const getTutorCourses = async (req, res) => {
  try {
    const userId = req.auth.id;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    };

    const all = await CourseModel.find({ userId }).exec();

    if (!all) return res.status(404).json({ message: "No courses found for this tutor!" });
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};


// Update a course
export const updateCourse = async (req, res, next) => {
  try {
    const { error, value } = courseUpdateValidator.validate({
      ...req.body,
      videoUrl: req.files?.videoUrl ? req.files.videoUrl.map(file => file.filename) : [],
      // videoUrl: req.files?.map((file) => {
      //   return file.filename;
      // }),
      pictures: req.files?.pictures ? req.files.pictures.map(file => file.filename) : [],
      // pictures: req.files?.map((file) => {
      // return file.filename;
      // }),
      quiz: req.body.quiz ? JSON.parse(req.body.quiz) : [], // Parse the quiz JSON string into an array
    });

    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }
    console.log(error);

    const course = await CourseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.userId.toString() !== req.auth.id) {
      return res.status(403).json({ message: 'Unauthorized to modify this course' });
    }

    const updatedCourse = await CourseModel.findByIdAndUpdate(
      req.params.id,
      { ...value, userId: req.auth.id }, // A different tutor can't update a content that isn't his/hers
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};


// Delete a course
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await CourseModel.findById(id)
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    };

    const isOwner = course.userId.toString() === req.auth.id;
    const isAdmin = req.auth.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json("Unauthorized to delete this course")
    }

    await CourseModel.deleteOne({ _id: id })
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//replace a course
export const replaceCourse = async (req, res, next) => {
  try {

    let quizData; // declare without value

    if (typeof req.body.quiz === 'string') {
      quizData = JSON.parse(req.body.quiz); // assign value after parsing
    } else {
      quizData = req.body.quiz; // assign directly if already an object
    }

    // Validate incoming request
    const { error, value } = replaceCourseValidator.validate({
      ...req.body,
      videoUrl: req.files?.videoUrl ? req.files.videoUrl.map(file => file.filename) : [],
      // videoUrl: req.files?.map((file) => {
      //   return file.filename;
      // }),
      pictures: req.files?.pictures ? req.files.pictures.map(file => file.filename) : [],
      // pictures: req.files?.map((file) => {
      // return file.filename;
      // }),
      quiz: quizData,  // Parse the quiz JSON string into an array
    });
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }

    const course = await CourseModel.findById(req.params.id)
    if (!course) {
      return res.status(404).json('Course not found')
    }

    if (course.userId.toString() !== req.auth.id) {
      return res.status(403).json("You're not authorized to perform this action")
    }

    // Perform replace operation
    const result = await CourseModel.findOneAndReplace(
      { _id: req.params.id },
      { ...value, userId: req.auth.id },
      { returnDocument: "after" }
    );

    // Return the updated document
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


//search and filtering
export const searchCourses = async (req, res, next) => {
  try {
    // 1. Parse query parameters
    const {
      title = '',
      category = '',
      difficultyLevel = '',
    } = req.query;

    // 2. Build the MongoDB query
    const query = {
      ...(title && { title: { $regex: title, $options: 'i' } }), // Case-insensitive title search
      ...(category && { category: { $regex: category, $options: 'i' } }),
      ...(category && { category }), // Exact category match
      ...(difficultyLevel && { difficultyLevel })

    };

    // 3. Execute the query with default sorting (newest first)
    const lessons = await CourseModel.find(query)
      .sort({ createdAt: -1 })
      .lean(); // Better performance

    // 4. Send standardized response
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });

  } catch (error) {
    // 5. Consistent error handling
    next(error);
  }
};