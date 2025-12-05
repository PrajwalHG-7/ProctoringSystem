import { useEffect, useState } from "react";
import { StartBackend } from "../../aiServices/aiBackendSwitch";
import useCheatData, { closeWS } from "../../aiServices/CheatData";
import CheatAlert from "./CheatAlert";
import Instructions from "./Instructions";
import Questions from "./Questions";
import Timer from "./Timer";
import QuestionNav from "./QuestionNav";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useParams, useNavigate } from "react-router-dom";

const TestPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);
    const [backendStarted, setBackendStarted] = useState(false);
    const [exam, setExam] = useState<any>({});
    const [currentIndex, setCurrentIndex] = useState(0);

    // Stores user's answers: { 0: "String", 1: "const", ... }
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

    const { cheat, cheat_count, cheat_percentage } = useCheatData(backendStarted);

    // Fetch exam data
    const fetchExamData = async () => {
        try {
            const res = await axiosInstance.get(`/api/v1/s/start/${examId}`);
            setExam(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExamData();
    }, [examId]);

    // AI backend init
    useEffect(() => {
        StartBackend()
            .then(async () => {
                console.log("Backend started successfully");
                setBackendStarted(true);
            })
            .catch(console.error);

        return () => closeWS();
    }, []);

    // Cheating alert handler
    useEffect(() => {
        if (cheat) {
            setShowAlert(true);
            const timeout = setTimeout(() => setShowAlert(false), 10000);
            return () => clearTimeout(timeout);
        }
    }, [cheat]);

    // ---------------------------------------
    // 🔥 SUBMIT LOGIC
    // ---------------------------------------
    const handleSubmit = async () => {
        if (!exam.questionData) return;

        // 1️⃣ Calculate Score
        let score = 0;
        exam.questionData.forEach((q: any, index: number) => {
            if (selectedAnswers[index] === q.correctOption)
                score += exam.scorePerQuestion;
        });

        // 2️⃣ Call backend
        try {
            await axiosInstance.post(API_PATHS.STUDENT.SUBMIT_EXAM, {
                examId,
                score,
                cheatCount: cheat_count,
            });

            alert("Exam submitted successfully!");
            navigate("/submit"); // redirect home
        } catch (error) {
            console.error(error);
            alert("Error submitting exam.");
        }
    };

    if (showAlert) {
        return (
            <CheatAlert
                cheatCount={cheat_count}
                cheatPercentage={cheat_percentage}
                onResume={() => setShowAlert(false)}
            />
        );
    }

    return (
        <div className="flex flex-col gap-3 pb-7">
            <div className="flex w-full items-center relative">
                <div className="absolute left-1/2 -translate-x-1/2 text-3xl text-primary1 font-semibold">
                    {exam.examName}
                </div>

                <div className="ml-auto">
                    <Timer time={exam.examDuration} />
                </div>
            </div>

            <div className="flex px-4 justify-around">
                <Instructions />

                <Questions
                    questionData={exam.questionData || []}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    selectedAnswers={selectedAnswers}
                    setSelectedAnswers={setSelectedAnswers}
                />

                <QuestionNav
                    totalQuestions={exam.questionData?.length || 0}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default TestPage