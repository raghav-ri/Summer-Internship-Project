import express from 'express'
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import path from "path";
import dotenv from 'dotenv';


dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}


app.use(express.json()); // this is middleware
// Middleware to log request details





// app.use((req, res, next) => {
//     console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
//     next(); // Call the next middleware or route handler
// }) 



app.use("/api/routes", notesRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}




connectDB()





app.listen(5000, () => {
    console.log('Server is running on port 5000')
});


