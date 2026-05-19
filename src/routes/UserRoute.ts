
import express from 'express';
import * as UserController from '../controllers/UserController.js';

const UserRoute = express.Router();
import { userAuth } from '../middlewares/auth.js';

UserRoute.use('/register' , UserController.signup);
UserRoute.use('/login' , UserController.login);

UserRoute.use('/profile' , userAuth , UserController.userProfile);

export default UserRoute;