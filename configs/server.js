'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import courseRoutes from '../src/course/course.routes.js';
import studentRoutes from '../src/student/student.routes.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/control/v1/users';
        this.authPath = '/control/v1/auth';
        this.coursePath = '/control/v1/courses';
        this.studentPath = '/control/v1/students';

        this.middlewares();
        this.connectDB();
        this.routes();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }

    async connectDB(){
        await dbConnection();
    }

    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.coursePath, courseRoutes);
        this.app.use(this.studentPath, studentRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default Server;