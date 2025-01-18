import express from 'express';
import dotenv from 'dotenv';
import courseRoutes from "./routes/courseRoutes.js";
dotenv.config();

import cors from 'cors';
import router from './routes/authRoutes.js';
import connectDB from './db.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());   

connectDB()

app.use('/api/courses', courseRoutes)

app.use("/api/auth", router);



const PORT = process.env.PORT || 5001;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
})