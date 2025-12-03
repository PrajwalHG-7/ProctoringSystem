import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoute.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/t', teacherRoutes);
app.use('/api/v1/s', studentRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
