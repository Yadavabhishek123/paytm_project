import express from "express";
import rootRouter from "./routes/index.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors()); // using cors middleware



async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

app.use(express.json());

app.use("/api/v1", rootRouter);


app.listen(3000)
