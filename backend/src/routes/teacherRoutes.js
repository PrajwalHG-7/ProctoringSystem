import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getTeacherData, addExam, fetchAllExams, fetchExamData, deleteExam } from "../controllers/teacherController.js"

const router = express.Router()

router.get("/dashboard", protect, getTeacherData)
router.post("/addExam", protect, addExam)
router.get("/exam", protect, fetchAllExams)
router.get("/exam/:examId", protect, fetchExamData)
router.delete("/delete/:examId", protect, deleteExam)

export default router