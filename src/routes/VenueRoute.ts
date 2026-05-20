
import express from 'express';

const VenueRoute = express.Router();
import { userAuth } from '../middlewares/auth.js';
import * as VenueController from '../controllers/VenueController.js';

VenueRoute.post('/venue' , VenueController.createVenue);


export default VenueRoute;