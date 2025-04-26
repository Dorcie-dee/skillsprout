import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth_route.js';
import dotenv from 'dotenv'
import courseRouter from './routes/course_route.js';


dotenv.config()
await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));



const app = express();
const PORT = 6002;

app.use(cors());
app.use(express.json());
app.use('/api/users', authRouter);
app.use('/api/courses', courseRouter);


const port = process.env.PORT || 6002;
app.listen(PORT, () => {
  console.log("Server running smoothly")
});