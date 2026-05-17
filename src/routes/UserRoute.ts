
import express from 'express';
import * as UserController from '../controllers/UserController.js';

const UserRoute = express.Router();

UserRoute.use('/register' , UserController.signup);
UserRoute.use('/login' , UserController.login);

export default UserRoute;