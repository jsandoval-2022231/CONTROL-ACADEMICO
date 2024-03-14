import e, { response, request } from "express";
import Course from './course.model.js';
import Teacher from '../teacher/teacher.model.js';
import Student from '../student/student.model.js';

export const createCourse = async (req, res) => {
    const id = req.user._id;
    const { name, description } = req.body;
    const course = new Course({ name, description });

    const teacher = await Teacher.findOne({ user: id });

    await course.save();
    teacher.courses.push(course);
    await teacher.save();
    res.status(200).json({
        course
    });
}

export const getMyCourses = async (req, res) => {
    const id = req.user._id;
    const query = { user: id };

    const teacher = await Teacher.findOne(query).populate('courses');

    const courses = teacher.courses.filter(course => course.status === true);
    res.status(200).json({ msg: "Your courses: ",  courses });
}

export const getCourses = async (req = request, res = response) => {
    const query = { status: true };

    const [total, courses] = await Promise.all([
        Course.countDocuments(query),
        Course.find(query)
    ]);

    res.status(200).json({ total, courses });
}

export const updateMyCourse = async (req, res = response) => {
    const idTeacher = req.user._id;
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    const teacher = await Teacher.findOne({ user: idTeacher, courses: id });

    if (!teacher) {
        return res.status(404).json({ error: 'The course is not yours' });
    }

    await Course.findByIdAndUpdate(id, rest);
    const course = await Course.findById(id);
    if (!course) {
        return res.status(404).json({ error: 'The course is not found' });
    }

    res.status(200).json({ msg: 'Course Updated', course });

}

export const deleteMyCourse = async (req, res) => {
    const idTeacher = req.user._id;
    const { id } = req.params;

    const teacher = await Teacher.findOne({ user: idTeacher, courses: id });

    if (!teacher) {
        return res.status(404).json({ error: 'The course is not yours' });
    }

    await Course.findByIdAndUpdate(id, { status: false });
    const course = await Course.findById(id);
    

    res.status(200).json({ msg: 'Course Deleted', course });
}

export const deleteCourseAndRemoveFromStudents = async (req, res = response) => {
    const teacherId = req.user._id;
    const { id } = req.params;


    console.log(id);
    const deletedCourse = await Course.findByIdAndUpdate(id, { status: false });
    if (!deletedCourse) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const students = await Student.find({ courses: id });
    for (const student of students) {
        student.courses.pull(id);
        await student.save();
    }

    res.status(200).json({ msg: 'Course deleted successfully' });
};