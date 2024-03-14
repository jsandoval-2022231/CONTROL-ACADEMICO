import { response, request } from "express";
import Student from './student.model.js';

export const addCourseToStudent = async (req, res = response) => {
    const idStudent = req.user._id;
    const { courses } = req.body;

    const student = await Student.findOne({ user: idStudent });

    for(const course of student.courses){
        const courseId = course._id.toString();
        if(courses.includes(courseId)){
            return res.status(400).json({ msg: 'The course is already added' });
        }
        if(student.courses.length > 2){
            return res.status(400).json({ msg: 'You can not add more than 3 courses' });
        }
    }

    student.courses.push(...courses);
    await student.save();

    res.status(200).json({ msg: 'Course added to student', student });

}

export const getMyCourses = async (req, res = response) => {
    const idStudent = req.user._id;
    const query = { user: idStudent };

    const student = await Student.findOne({ user: idStudent }).populate('courses');

    const course = student.courses.filter(course => course.status === true);
    res.status(200).json({ msg: "Your courses: ", course });
}


