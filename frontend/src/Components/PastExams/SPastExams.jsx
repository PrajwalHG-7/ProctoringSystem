import { Divider } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";

const SPastExams = () => {
    const [exams, setExams] = useState([]);

    const calculatePercentage = (score, total) => {
        if (!total || total === 0) return "0.00";
        return ((score / total) * 100).toFixed(2);
    };

    const calculateGrade = (percentage) => {
        const p = Number(percentage);
        if (p >= 90) return "A+";
        if (p >= 80) return "A";
        if (p >= 70) return "B+";
        if (p >= 60) return "B";
        if (p >= 50) return "C";
        if (p >= 40) return "D";
        return "F";
    };

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.STUDENT.GET_ALL_EXAMS);
                const sorted = res.data.sort(
                    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                );
                setExams(sorted);
            } catch (err) {
                console.error("Error fetching exam data:", err);
            }
        };

        fetchExams();
    }, []);

    const gridCols = "grid grid-cols-[250px_1fr_60px_70px_70px_90px] gap-x-4 items-center";

    return (
        <div className="w-3/5 min-h-[50vh] flex p-10 flex-col gap-4 items-center">
            <h2 className="text-primary text-2xl font-bold">Your Past Exams</h2>

            <div className="border border-mine-shaft-500 rounded-lg min-w-[100vh] min-h-[60vh] max-h-[60vh] p-4 flex flex-col">
                <div className={`${gridCols} pb-3 pt-1 text-primary font-semibold text-sm`}>
                    <div className="text-left">Exam Name</div>
                    <div className="text-left">Submission Date</div>
                    <div className="text-center">Marks</div>
                    <div className="text-center">Total</div>
                    <div className="text-center">Percentage</div>
                    <div className="text-center">Grade</div>
                </div>

                <Divider color="mine-shaft.6" />

                <div
                    className="mt-3 overflow-y-auto"
                    style={{ maxHeight: "50vh" }}
                >
                    {exams.length === 0 ? (
                        <p className="text-gray-400 text-center mt-10">No past exams found.</p>
                    ) : (
                        <div className="flex flex-col">
                            {exams.map((exam) => {
                                const percentage = calculatePercentage(exam.score, exam.totalScore);
                                const grade = calculateGrade(percentage);

                                return (
                                    <div
                                        key={exam._id}
                                        className={`${gridCols} text-gray-300 py-4 pl-1 border-b border-mine-shaft-700`}
                                    >
                                        <div className="text-left whitespace-normal break-words leading-tight">
                                            {exam.examName}
                                        </div>
                                        <div className="text-center pl-4">
                                            {new Date(exam.timestamp).toLocaleDateString("en-IN")}
                                        </div>

                                        <div className="pl-8 text-center">{exam.score}</div>
                                        <div className="pl-8 text-center">{exam.totalScore}</div>
                                        <div className="pl-8 text-right">{percentage}%</div>
                                        <div className="text-right pr-4 font-bold text-primary">{grade}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SPastExams