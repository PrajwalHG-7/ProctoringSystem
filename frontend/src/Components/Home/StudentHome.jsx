import React, { useState } from "react"
import Input from "../inputs/Input"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { Navigate } from "react-router-dom"
import Modal from "../Modal"

const StudentHome = () => {
    const [examId, setExamId] = useState("")
    const [error, setError] = useState("")
    const navigate = Navigate()

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
        <div className="flex ">
            <div className="">
                <Input
                    type="text"
                    label="Exam Code"
                    placeholder="Enter a exam code"
                    onChange={(target) => setExamId(target)}
                />
            </div>

            <div className="">
                <button
                    type="button"
                    className='btn-primary'
                    onClick={
                        <Modal>

                        </Modal>
                    }
                >
                    Find Exam
                </button>
            </div>
        </div>
    )
}

export default StudentHome