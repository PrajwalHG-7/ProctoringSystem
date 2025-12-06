import mongoose from "mongoose"

const examDataSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
    totalScore: { type: Number, required: true },
    examName: { type: String, required: true },
    cheatCount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
})

export default mongoose.models.ExamData || mongoose.model("ExamData", examDataSchema);