import { CourseModel } from "../models/course_model.js";
// import { validateCourse } from "../validators/courseValidator.js";
import { v2 as cloudinary } from "cloudinary";
import { courseValidator } from "../validators/course_validator.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { error, value } = courseValidator.validate({
      ...req.body,
      videoUrl: req.files?.map((file) => {
        return file.filename;
      }),
      pictures: req.files?.map((file) => {
        return file.filename;
      }),
    });
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


export const getTutorCourses = async (req, res) => {
  try {
    const userId = req.auth.id
    const all = await CourseModel.find({ userId }).exec();
    if (!all) return res.status(404).json({ message: "Tutor not found!" });
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};


// Update a course
export const updateCourse = async (req, res, next) => {
  try {
    const { error, value } = courseValidator.validate({
      ...req.body,
      videoUrl: req.files?.map((file) => {
        return file.filename;
      }),
      pictures: req.files?.map((file) => {
        return file.filename;
      }),
    });
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }
    console.log(error);

    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path);
    //   validatedData.videoUrl = result.secure_url;
    // }

    const course = await CourseModel.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// Delete a course
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CourseModel.findByIdAndDelete(id).exec();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};