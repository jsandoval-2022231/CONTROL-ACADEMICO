import mongoose from "mongoose";

const CourseSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    status: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model("Course", CourseSchema);