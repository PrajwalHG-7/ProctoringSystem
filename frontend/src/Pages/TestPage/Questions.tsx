import { Button, Divider } from "@mantine/core";

interface Question {
    question: string;
    options: string[];
    correctOption: string;
    _id: string;
}

interface QuestionsProps {
    questionData: Question[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;

    // NEW — comes from parent (TestPage)
    selectedAnswers: { [key: number]: string };
    setSelectedAnswers: (answers: { [key: number]: string }) => void;
}

const Questions = ({
    questionData,
    currentIndex,
    setCurrentIndex,
    selectedAnswers,
    setSelectedAnswers
}: QuestionsProps) => {

    if (!questionData || questionData.length === 0) {
        return (
            <div className="flex items-center justify-center w-7/12 h-[67vh] bg-mine-shaft-800 rounded-xl text-primary text-lg">
                Loading questions...
            </div>
        );
    }

    const currentQuestion = questionData[currentIndex];

    const handleSelectOption = (option: string) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentIndex]: option
        });
    };

    const handleNext = () => {
        if (currentIndex < questionData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="flex flex-col w-7/12 h-[67vh] gap-5 bg-mine-shaft-800 rounded-xl p-8">

            {/* Question Text */}
            <div className="text-justify text-primary text-xl font-semibold">
                {currentQuestion.question}
            </div>

            <Divider color="mine-shaft.5" size="xs" className="w-full" />

            {/* Options */}
            <div className="flex flex-col gap-4">
                {currentQuestion.options.map((opt, i) => {
                    const isSelected = selectedAnswers[currentIndex] === opt;

                    return (
                        <div
                            key={i}
                            onClick={() => handleSelectOption(opt)}
                            className={`
                                px-4 py-3 rounded-lg cursor-pointer transition text-lg
                                ${isSelected
                                    ? "bg-bright-sun-500 text-mine-shaft-950 font-semibold"
                                    : "bg-mine-shaft-700 text-primary hover:bg-bright-sun-500 hover:text-mine-shaft-950"}
                            `}
                        >
                            {opt}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-col w-full h-full justify-end gap-5">
                <Divider color="mine-shaft.5" size="xs" className="w-full" />

                <div className="flex w-full justify-between items-center">
                    <Button onClick={handlePrev} disabled={currentIndex === 0}>
                        <div className="text-mine-shaft-900">Prev</div>
                    </Button>

                    <div className="text-primary font-semibold">
                        {currentIndex + 1} / {questionData.length}
                    </div>

                    <Button
                        onClick={handleNext}
                        disabled={currentIndex === questionData.length - 1}
                    >
                        <div className="text-mine-shaft-900">Next</div>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Questions