import express from 'express'
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import dotenv from 'dotenv';


dotenv.config();

const app = express()
connectDB();


app.use(cors(
    {
        origin: "http://localhost:5173",
    }
));


app.use(express.json()); // this is middleware
// Middleware to log request details




// app.use((req, res, next) => {
//     console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
//     next(); // Call the next middleware or route handler
// }) 



app.use("/api/routes",notesRoutes);




app.listen(5000, () => {
    console.log('Server is running on port 5000')
});


