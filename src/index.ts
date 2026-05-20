

import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import { dbConnection } from './config/dbConfig.js';


// Global variables 
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



// import routes here
import UserRoute from './routes/UserRoute.js';
import EventRoute from './routes/EventRoute.js';
import ShowsRoute from './routes/ShowsRoute.js';
import VenueRoute from './routes/VenueRoute.js';

app.use('/api/v1/user' , UserRoute);
app.use('/api/v1' ,EventRoute);
app.use('/api/v1' , ShowsRoute);
app.use('/api/v1' , VenueRoute);



// 🔹 Start server
const startServer = async () => {
  try {
    await dbConnection();

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

  } catch (err) {
    console.error("❌ App failed to start:", err);
    process.exit(1);
  }
};

startServer();