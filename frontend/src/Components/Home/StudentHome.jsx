import React, { useState } from "react"
import Input from "../inputs/Input"
import { useNavigate } from "react-router-dom"
import Modal from "../Modal"

const StudentHome = () => {
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
        <div className="flex w-full min-h-[81vh] gap-4 items-center justify-center">
            <div className="w-1/2">
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
        </div>
    )
}

export default StudentHome