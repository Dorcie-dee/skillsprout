import { Router } from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseById, replaceCourse, searchCourses, updateCourse } from "../controllers/course_controller.js";
import { upload } from "../middleware/upload.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth_middleware.js";

const courseRouter = Router();

courseRouter.post('/', isAuthenticated, 
  isAuthorized(['Tutor']), 
upload.array('video', 2), 
createCourse);

courseRouter.get('/', getAllCourses);

courseRouter.get('/search', searchCourses);

courseRouter.get('/:id', getCourseById);

courseRouter.patch('/:id', 
  isAuthenticated, 
  upload.array('video', 2), 
updateCourse);

courseRouter.put('/:id', 
  isAuthenticated, 
  upload.array('videos', 2), 
  replaceCourse);

courseRouter.delete('/:id', 
  isAuthenticated, 
  isAuthorized,
  deleteCourse);

export default courseRouter;