import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getStudentData, fetchAllExams, submitExam, startExam } from "../controllers/studentController.js"

const router = express.Router()

router.get("/dashboard", protect, getStudentData)
router.get("/start/:examId", protect, startExam)
router.post("/submit", protect, submitExam)
router.get("/exam", protect, fetchAllExams)

export default router