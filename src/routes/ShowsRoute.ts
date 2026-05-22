
import express from 'express';
import { userAuth } from '../middlewares/auth.js';

import * as ShowsController from '../controllers/ShowsController.js';

const ShowsRoute = express.Router();


ShowsRoute.post('/shows' , userAuth , ShowsController.createShow);


// create show seats route
ShowsRoute.post('/shows/:showId/seats' , ShowsController.getShowSeats)




export default ShowsRoute;