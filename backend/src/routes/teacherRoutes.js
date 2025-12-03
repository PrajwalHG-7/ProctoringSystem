import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getTeacherData, addExam, fetchAllExams, fetchExamData } from "../controllers/teacherController.js"

const router = express.Router()

router.get("/dashboard", protect, getTeacherData)
router.post("/addExam", protect, addExam)
router.get("/exam", protect, fetchAllExams)
router.get("/exam/:examId", protect, fetchExamData)

export default router