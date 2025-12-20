import Instructions from "./Instructions";
import Questions from "./Questions";
import Timer from "./Timer";
import QuestionNav from "./QuestionNav";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Camera, { CameraHandle } from "./Camera";


const TestPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState<any>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const cameraRef = useRef<CameraHandle | null>(null);

    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

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

    const handleSubmit = async () => {
        // 🔴 STOP PROCTORING FIRST (CRITICAL)
        if (cameraRef.current) {
            cameraRef.current.cleanup();
        }

        if (!exam.questionData) return;

        let score = 0;
        exam.questionData.forEach((q: any, index: number) => {
            if (selectedAnswers[index] === q.correctOption) {
                score += exam.scorePerQuestion;
            }
        });

        try {
            await axiosInstance.post(API_PATHS.STUDENT.SUBMIT_EXAM, {
                examId,
                score,
                cheatCount: 0,
            });

            alert("Exam submitted successfully!");
            navigate("/submit");
        } catch (error) {
            console.error(error);
            alert("Error submitting exam.");
        }
    };


    return (
        <div className="flex flex-col gap-3 pb-7">
            <div className="flex w-full items-center justify-between relative">
                <div className="ml-40">
                    <Camera ref={cameraRef} />
                </div>

                <div className="text-3xl text-primary1 font-semibold">
                    {exam.examName}
                </div>

                <div className="">
                    <Timer time={exam.examDuration} onTimeUp={handleSubmit} />
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