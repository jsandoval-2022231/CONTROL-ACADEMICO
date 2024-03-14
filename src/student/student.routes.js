import { Router } from "express";
import { check } from "express-validator";

import { addCourseToStudent, getMyCourses } from "./student.controller.js";

import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT} from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.post(
    '/add-course',
    [
        validateJWT,
        hasRole("STUDENT_ROLE"),
        check("courses", "Courses required").not().isEmpty(),
        validInputs
    ],
    addCourseToStudent
);

router.get('/my-courses',
    [
        validateJWT,
        hasRole("STUDENT_ROLE"),
    ],
    getMyCourses
);

export default router;