import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth_route.js';
import dotenv from 'dotenv'


dotenv.config()
await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));



const app = express();
const PORT = 6002;


app.use(express.json());
app.use('/api/users', authRouter);



const port = process.env.PORT || 6002;
app.listen(PORT, () => {
  console.log("Server running on Jollof rice with grilled chicken")
});