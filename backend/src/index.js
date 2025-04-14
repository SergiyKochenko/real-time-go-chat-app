import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import { connect } from 'mongoose';

dotenv.config();

const app = express();

const PORT = process.env.PORT

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
  connectDB();
});