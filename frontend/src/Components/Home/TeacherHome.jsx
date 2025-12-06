import React from "react"
import TPastExams from "../PastExams/TPastExams"
import { useNavigate } from "react-router-dom"

const TeacherHome = () => {
    const navigate = useNavigate()

    const newExam = () => {
        navigate("/create")
    }

    return (
        <div className="flex w-full min-h-[81vh] gap-4">
            <div className="w-2/5 p-10 flex flex-col gap-10 items-center justify-center">
                <h2 className="text-primary text-4xl font-semibold text-left min-w-[530px]">
                    Create and post a new <p className="text-right pt-5 pr-6">Exam now!!!</p>
                </h2>

                <button
                    type="button"
                    className='btn-primary min-h-[80px] self-end max-w-full'
                    onClick={newExam}
                >
                    Create New Exam
                </button>
            </div>

            <TPastExams />
        </div>
    )
}

export default TeacherHome