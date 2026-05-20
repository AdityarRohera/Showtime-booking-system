
import express from 'express';
import { userAuth } from '../middlewares/auth.js';

const ShowsRoute = express.Router();


// ShowsRoute.post('/events' , userAuth , EventController.createEvent);

// ShowsRoute.get('/events' , userAuth , EventController.getEvent);

// ShowsRoute.get('/events/:eventId' , userAuth , EventController.getSingleEvent);

// ShowsRoute.put('/events/:eventId' , userAuth , EventController.updateEvent);




export default ShowsRoute;