import { Router } from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseById, getTutorCourses, replaceCourse, searchCourses, updateCourse } from "../controllers/course_controller.js";
import { upload } from "../middleware/upload.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth_middleware.js";
import { completeLesson } from "../controllers/gamification_controller.js";


const courseRouter = Router();

courseRouter.post('/', isAuthenticated, 
  isAuthorized(['tutor', 'admin']), 
  upload.fields([
    { name: 'videoUrl', maxCount: 1 },
    { name: 'pictures', maxCount: 5 }
  ]), 
createCourse);


courseRouter.post('/complete', isAuthenticated, completeLesson);


courseRouter.get('/', getAllCourses);

courseRouter.get('/my-courses', isAuthenticated, getTutorCourses);

courseRouter.get('/search', searchCourses);

courseRouter.get('/:id', getCourseById);

courseRouter.patch('/:id', 
  isAuthenticated, 
  isAuthorized(['tutor', 'admin']),
  upload.array('video', 2), 
updateCourse);

courseRouter.put('/:id', 
  isAuthenticated, 
  isAuthorized(['tutor', 'admin']),
  upload.array('videos', 2), 
  replaceCourse);

courseRouter.delete('/:id', 
  isAuthenticated, 
  isAuthorized(['tutor', 'admin']),
  deleteCourse);

export default courseRouter;