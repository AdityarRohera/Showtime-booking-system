

import express from 'express';
import { userAuth } from '../middlewares/auth.js';


const BookingRoute = express.Router();

BookingRoute.post('/bookings/lock-seats' , userAuth)



export default BookingRoute;