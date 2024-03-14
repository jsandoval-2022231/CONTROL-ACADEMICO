import { Router } from "express";
import { check } from "express-validator";

import { createCourse, getCourses, getMyCourses, deleteMyCourse, updateMyCourse, deleteCourseAndRemoveFromStudents } from "./course.controller.js";

import { existsEmail, existsUserById } from "../helpers/db-validators.js";
import { validInputs } from "../middlewares/valid-inputs.js";
import { validateJWT} from "../middlewares/valid-jwt.js";
import { hasRole } from "../middlewares/valid-roles.js";

const router = Router();

router.post(
    '/',
    [
        validateJWT,
        hasRole("TEACHER_ROLE"),
        check("name", "Name required").not().isEmpty(),
        check("description", "Description required").not().isEmpty(),
        validInputs
    ],
    createCourse
);

router.get('/',
    getCourses
);

router.get('/my-courses',
    [
        validateJWT,
        hasRole("TEACHER_ROLE"),
    ],
    getMyCourses
);

router.put(
    '/:id',
    [
        validateJWT,
        hasRole("TEACHER_ROLE"),
        check("id", "Id required").not().isEmpty(),
        check("id", "Id invalid").isMongoId(),
        validInputs
    ],
    updateMyCourse
);

router.delete(
    '/:id',
    [
        validateJWT,
        hasRole("TEACHER_ROLE"),
        check("id", "Id required").not().isEmpty(),
        check("id", "Id invalid").isMongoId(),
        validInputs,
    ],
    deleteMyCourse 
);

router.delete(
    '/delete/:id',
    [
        validateJWT,
        hasRole("TEACHER_ROLE"),
        check("id", "Id required").not().isEmpty(),
        check("id", "Id invalid").isMongoId(),
        validInputs,
    ],
    deleteCourseAndRemoveFromStudents
);


export default router;