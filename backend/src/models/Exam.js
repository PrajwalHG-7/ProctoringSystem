import mongoose from "mongoose"

const examSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    examName: { type: String, required: true },
    examDescription: { type: String, required: true },
    examDuration: { type: Number, required: true },
    questionData: [
        {
            question: { type: String, required: true },
            options: [
                {
                    type: String,
                    required: true
                }
            ],
            correctOption: { type: String, required: true }
        }
    ],
    scorePerQuestion: { type: Number, required: true },
    totalScore: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
})

export default mongoose.models.Exam || mongoose.model("Exam", examSchema);