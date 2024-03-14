import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import Teacher from '../teacher/teacher.model.js';
import Student from '../student/student.model.js';

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    if(role === "TEACHER_ROLE"){
        const teacher = new Teacher({ user });
        await teacher.save();

    }else{
        const student = new Student({ user });
        await student.save();
    }
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();
    res.status(200).json({
        user
    });
}

export const getUsers = async (req = request, res = response) => {
    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.status(200).json({ total, users });
}

export const updateUser = async (req, res = response) => {
    const { id } = req.params;
    const { _id, email, password, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate(id, rest);

    const user = await User.findOne({ _id: id });

    res.status(200).json({ msg: 'User Updated', user });
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log("req.user.accessToken: ", req.user.accessToken);
    const user = await User.findByIdAndUpdate(id, { status: false });
    const authenticatedUser = req.user;

    res.status(200).json({ msg: 'User Deleted', user, authenticatedUser });
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    res.status(200).json({ user });
}

// ---------------------------- Own User ----------------------------

export const updateOwnUser = async (req, res = response) => {
    const id = req.user.uid;
    const { _id, email, password, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate(id, rest);

    const user = await User.findOne({ _id: id });

    res.status(200).json({ msg: 'User Updated', user });
}

export const deleteOwnUser = async (req, res) => {
    const id = req.user.uid;
    await User.findByIdAndUpdate(id, { status: false });
    const user = await User.findOne({ _id: id });

    res.status(200).json({ msg: 'User Deleted', user });
}