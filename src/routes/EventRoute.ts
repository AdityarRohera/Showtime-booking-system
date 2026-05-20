
import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import * as EventController from '../controllers/EventController.js';

const EventRoute = express.Router();


EventRoute.post('/events' , userAuth , EventController.createEvent);

EventRoute.get('/events' , userAuth , EventController.getEvent);

EventRoute.get('/events/:eventId' , userAuth , EventController.getSingleEvent);

EventRoute.put('/events/:eventId' , userAuth , EventController.updateEvent);




export default EventRoute;