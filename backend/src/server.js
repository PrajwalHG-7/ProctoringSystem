import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from "url";
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoute.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
const allowedOrigins = process.env.CLIENT_URLS?.split(",") || [];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS: Not allowed by origin"));
        }
    },
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/t', teacherRoutes)
app.use('/api/v1/s', studentRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
