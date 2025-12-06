import React, { useState } from "react"
import Input from "../inputs/Input"
import { useNavigate } from "react-router-dom"
import Modal from "../Modal"
import SPastExams from "../PastExams/SPastExams"

const StudentHome = ({ studentId }) => {
    const [examId, setExamId] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            navigate(`/test/${examId}`)
        } catch (err) {
            if (err.response && err.response.data.message) {
                setError(err.response.data.message)
            }
            else {
                setError("Something went wrong. Please try again.")
            }
        }
    }

    return (
        <div className="flex w-full min-h-[81vh] gap-4">
            <div className="w-2/5 p-10 flex flex-col gap-4 items-center justify-center">
                <Input
                    type="text"
                    label="Exam Code"
                    placeholder="Enter a exam code"
                    onChange={({ target }) => setExamId(target.value)}
                />

                <button
                    type="button"
                    className='btn-primary'
                    onClick={handleSubmit}
                >
                    Find Exam
                </button>
            </div>

            <SPastExams />
        </div>
    )
}

export default StudentHome