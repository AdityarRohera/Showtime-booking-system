
import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import * as EventController from '../controllers/EventController.js';

const EventRoute = express.Router();


EventRoute.post('/events' , userAuth , EventController.createEvent);

// APPLY QUERY PARAMETER AND FILTERING
// EventRoute.get('/events' , userAuth , getAllEventHandler);

// EventRoute.get('/eventS/:eventId' , userAuth , getFullEventHandler);

// EventRoute.put('/events/:eventId' , userAuth , updateEventHandler);




export default EventRoute;