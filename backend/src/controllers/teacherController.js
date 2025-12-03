import Exam from "../models/Exam.js"
import ExamData from "../models/ExamData.js"
import User from "../models/User.js"

export const addExam = async (req, res) => {
    if (req.user.role === "student") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const { examName, examDescription, examDuration, questionData, scorePerQuestion } = req.body

        if (!examName || !examDescription || !examDuration || !questionData || !scorePerQuestion) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const newExam = new Exam({
            userId: req.user.id,
            examName,
            examDescription,
            examDuration,
            questionData,
            scorePerQuestion,
            totalScore: questionData.length * scorePerQuestion
        })

        await newExam.save()

        res.status(200).json(newExam)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const fetchAllExams = async (req, res) => {
    if (req.user.role === "student") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id

    try {
        const exams = await Exam.find({ userId })
        res.json(exams)
    } catch (err) {
        res
            .status(500)
            .json({ message: "Server Error", error: err.message })
    }
}

export const fetchExamData = async (req, res) => {
    if (req.user.role === "student") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { examId } = req.params

    try {
        const examEntries = await ExamData.find({ examId })
            .populate({ path: "studentId", select: "fullName email" })
            .lean();

        const newExamData = examEntries.map(entry => ({
            _id: entry._id,
            examId: entry.examId,
            studentName: entry.studentId ? entry.studentId.fullName : null,
            studentEmail: entry.studentId ? entry.studentId.email : null,
            score: entry.score,
            totalScore: entry.totalScore,
            cheatCount: entry.cheatCount,
            timestamp: entry.timestamp,
            __v: entry.__v
        }))

        return res.json(newExamData)
    } catch (err) {
        res
            .status(500)
            .json({ message: "Server Error", error: err.message })
    }
}

export const getTeacherData = async (req, res) => {
    if (req.user.role === "student") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const user = await User.findById(req.user.id)
        res.json(user)
    } catch (err) {
        res
            .status(500)
            .json({ message: "Server Error", error: err.message })
    }
}