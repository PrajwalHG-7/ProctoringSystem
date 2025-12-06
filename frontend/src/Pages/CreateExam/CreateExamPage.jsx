import React, { useState } from "react";
import { Divider, Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateExamPage = () => {
    const navigate = useNavigate();

    // MAIN EXAM FIELDS
    const [examName, setExamName] = useState("");
    const [examDescription, setExamDescription] = useState("");
    const [examDuration, setExamDuration] = useState("");
    const [scorePerQuestion, setScorePerQuestion] = useState("");

    // QUESTIONS ARRAY
    const [questions, setQuestions] = useState([
        {
            question: "",
            options: [""],
            correctOption: "",
        },
    ]);

    const [activeQ, setActiveQ] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [createdExamId, setCreatedExamId] = useState("");

    // VALIDATION FUNCTION
    const validateQuestions = () => {
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            if (!q.question.trim()) {
                alert(`Question ${i + 1} cannot be empty`);
                return false;
            }

            const nonEmptyOptions = q.options.filter((o) => o.trim() !== "");
            if (nonEmptyOptions.length === 0) {
                alert(`Question ${i + 1} must have at least one option`);
                return false;
            }

            if (!q.correctOption || q.correctOption.trim() === "") {
                alert(`Please select a correct option for Question ${i + 1}`);
                return false;
            }
        }
        return true;
    };

    // ADD QUESTION
    const addQuestion = () => {
        if (!validateQuestions()) return;

        setQuestions([
            ...questions,
            { question: "", options: [""], correctOption: "" },
        ]);
        setActiveQ(questions.length);
    };

    // DELETE QUESTION
    const deleteQuestion = (index) => {
        if (questions.length === 1) {
            alert("At least one question is required");
            return;
        }

        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);

        if (activeQ === index) setActiveQ(0);
        else if (activeQ > index) setActiveQ(activeQ - 1);
    };

    // ADD OPTION
    const addOption = (qIndex) => {
        const q = [...questions];
        q[qIndex].options.push("");
        setQuestions(q);
    };

    // DELETE OPTION
    const deleteOption = (qIndex, optIndex) => {
        const q = [...questions];

        if (q[qIndex].options.length === 1) {
            alert("At least one option is required");
            return;
        }

        const removedOption = q[qIndex].options[optIndex];

        q[qIndex].options = q[qIndex].options.filter(
            (_, idx) => idx !== optIndex
        );

        // If deleted option was correct, reset correctOption
        if (q[qIndex].correctOption === removedOption) {
            q[qIndex].correctOption = "";
        }

        setQuestions(q);
    };

    // UPDATE QUESTION TEXT
    const updateQuestion = (index, value) => {
        const q = [...questions];
        q[index].question = value;
        setQuestions(q);
    };

    // UPDATE OPTION TEXT
    const updateOption = (qIndex, optIndex, value) => {
        const q = [...questions];
        q[qIndex].options[optIndex] = value;
        setQuestions(q);
    };

    // SET CORRECT OPTION
    const setCorrectOption = (qIndex, opt) => {
        const q = [...questions];
        q[qIndex].correctOption = opt;
        setQuestions(q);
    };

    // CREATE EXAM
    const createExam = async () => {
        if (!validateQuestions()) return;

        try {
            const payload = {
                examName,
                examDescription,
                examDuration,
                questionData: questions,
                scorePerQuestion,
            };

            const response = await axiosInstance.post(
                API_PATHS.TEACHER.ADD_EXAM,
                payload
            );

            setCreatedExamId(response.data._id);
            setModalOpen(true);

            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (err) {
            console.log(err);
            alert("Failed to create exam");
        }
    };

    const current = questions[activeQ];

    return (
        <div className="min-h-screen w-full bg-mine-shaft-950 text-white p-6 flex flex-col gap-6">

            {/* PAGE TITLE */}
            <h1 className="text-center text-3xl font-bold text-primary1">
                Create New Exam
            </h1>

            <div className="flex w-full h-full gap-6">

                {/* CENTER SECTION */}
                <div className="flex flex-col w-3/4 bg-mine-shaft-950 rounded-xl p-6">

                    {/* ROW 1 — NAME + DURATION + SCORE */}
                    <div className="flex gap-4 mb-4">

                        <input
                            type="text"
                            placeholder="Exam Name"
                            className="w-[60%] p-3 border border-mine-shaft-600 text-primary rounded bg-mine-shaft-900 outline-none"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Duration (minutes)"
                            className="w-[20%] p-3 border border-mine-shaft-600 text-primary rounded bg-mine-shaft-900 outline-none"
                            value={examDuration}
                            onChange={(e) => setExamDuration(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Score Per Question"
                            className="w-[20%] p-3 border border-mine-shaft-600 text-primary rounded bg-mine-shaft-900 outline-none"
                            value={scorePerQuestion}
                            onChange={(e) => setScorePerQuestion(e.target.value)}
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <textarea
                        placeholder="Exam Description"
                        className="mb-6 w-full p-3 border border-mine-shaft-600 text-primary rounded bg-mine-shaft-900 outline-none"
                        rows={2}
                        value={examDescription}
                        onChange={(e) => setExamDescription(e.target.value)}
                    />

                    <Divider color="mine-shaft.6" className="mb-4" />

                    {/* ACTIVE QUESTION */}
                    <h2 className="text-xl text-bright-sun-400 font-semibold mb-3">
                        Question {activeQ + 1}
                    </h2>

                    <input
                        type="text"
                        placeholder="Enter question"
                        className="p-3 mb-4 border border-mine-shaft-600 text-primary rounded bg-mine-shaft-900 outline-none"
                        value={current.question}
                        onChange={(e) => updateQuestion(activeQ, e.target.value)}
                    />

                    {/* OPTIONS */}
                    <div className="flex flex-col gap-3">
                        {current.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-mine-shaft-900 p-3 rounded">

                                {/* OPTION INPUT */}
                                <input
                                    type="text"
                                    placeholder={`Option ${idx + 1}`}
                                    className="bg-transparent flex-1 outline-none text-primary"
                                    value={opt}
                                    onChange={(e) =>
                                        updateOption(activeQ, idx, e.target.value)
                                    }
                                />

                                {/* CORRECT BUTTON */}
                                <button
                                    className={`px-3 py-1 hover:bg-bright-sun-400 hover:text-mine-shaft-950 rounded ${current.correctOption === opt
                                            ? "bg-bright-sun-400 text-mine-shaft-950 font-semibold"
                                            : "bg-bright-sun-600/10 text-bright-sun-400"
                                        }`}
                                    onClick={() => setCorrectOption(activeQ, opt)}
                                >
                                    Correct
                                </button>

                                {/* DELETE OPTION BUTTON */}
                                <button
                                    onClick={() => deleteOption(activeQ, idx)}
                                    className="px-3 py-1 rounded bg-bright-sun-600/10 text-bright-sun-400 
                                               hover:bg-red-500 hover:text-white border border-bright-sun-400 font-bold"
                                >
                                    X
                                </button>

                            </div>
                        ))}

                        <button
                            onClick={() => addOption(activeQ)}
                            className="bg-bright-sun-400 text-mine-shaft-950 hover:bg-bright-sun-600/10 
                                       hover:text-bright-sun-400 font-semibold text-lg px-4 py-2 rounded mt-2"
                        >
                            + Add Option
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-1/4 flex flex-col gap-4">

                    <div className="bg-mine-shaft-800 rounded-xl p-4 flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
                        <h3 className="text-lg text-bright-sun-400 font-bold">Questions</h3>

                        <div className="flex flex-wrap gap-2">
                            {questions.map((_, index) => (
                                <div key={index} className="flex items-center gap-1">

                                    <button
                                        onClick={() => setActiveQ(index)}
                                        className={`px-4 py-2 rounded ${activeQ === index
                                                ? "bg-bright-sun-400 font-semibold text-mine-shaft-950"
                                                : "bg-bright-sun-600/10 text-bright-sun-400 hover:bg-bright-sun-400 hover:text-mine-shaft-950"
                                            }`}
                                    >
                                        Q{index + 1}
                                    </button>

                                    <button
                                        onClick={() => deleteQuestion(index)}
                                        className="px-2 py-1 rounded bg-bright-sun-600/10 text-bright-sun-400 
                                                   hover:bg-red-500 hover:text-white border border-bright-sun-400 font-bold"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={addQuestion}
                                className="px-4 py-2 rounded bg-bright-sun-600/10 text-bright-sun-400 
                                           hover:bg-bright-sun-400 border border-bright-sun-400 hover:text-mine-shaft-950 font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        className="w-full bg-bright-sun-400 text-mine-shaft-950 hover:bg-bright-sun-600/10 
                                   hover:text-bright-sun-400 font-semibold text-lg px-6 py-3 rounded"
                        onClick={createExam}
                    >
                        Create Exam
                    </button>
                </div>
            </div>

            {/* MODAL */}
            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Exam Created!" centered>
                <div className="flex flex-col gap-3">
                    <p>Your Exam ID:</p>
                    <code className="bg-mine-shaft-800 p-3 rounded">{createdExamId}</code>
                    <p>Redirecting to dashboard...</p>
                </div>
            </Modal>
        </div>
    );
};

export default CreateExamPage