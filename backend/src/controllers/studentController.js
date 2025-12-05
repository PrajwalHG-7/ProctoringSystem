import ExamData from "../models/ExamData.js"
import User from "../models/User.js"
import Exam from "../models/Exam.js"
import { getUserInfo } from "./authController.js"
import mongoose from "mongoose"

export const fetchAllExams = async (req, res) => {
    if (req.user.role === "teacher") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const studentId = req.user.id

    try {
        const examData = await ExamData.find({ studentId })
        res.json(examData)
    } catch (err) {
        res
            .status(500)
            .json({ message: "Server Error", error: err.message })
    }
}

export const startExam = async (req, res) => {

    if (req.user.role === "teacher") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { examId } = req.params

    if (!mongoose.Types.ObjectId.isValid(examId)) {
        return res.status(400).json({ message: "Invalid Exam ID" });
    }

    try {
        const exam = await Exam.findById(examId)
        res.json(exam)
    } catch (err) {
        res
            .status(500)
            .json({ message: "Server Error", error: err.message })
    }
}

export const submitExam = async (req, res) => {
    if (req.user.role === "teacher") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { examId, score, cheatCount } = req.body

    try {
        const totalScore = await Exam.findById(examId).select("totalScore")

        const examData = await ExamData.create({ studentId: req.user.id, examId, score, totalScore: totalScore.totalScore, cheatCount })
        res.json(examData)
    } catch (err) {
        res
            .status(500)
            .json({ message: "Server Error", error: err.message })
    }
}

export const getStudentData = async (req, res) => {
    if (req.user.role === "teacher") {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const user = getUserInfo()
        res.json(user)
    } catch (err) {
        res
            .status(500)
            .json({ message: "Server Error", error: err.message })
    }
}