import { Button } from "@mantine/core";

const QuestionNav = ({
    totalQuestions,
    currentIndex,
    setCurrentIndex,
    onSubmit
}: {
    totalQuestions: number;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    onSubmit: () => void;
}) => {

    const questionButtons = Array.from({ length: totalQuestions }, (_, i) => (
        <Button
            key={i}
            variant="outline"
            color={currentIndex === i ? "bright-sun.4" : "mine-shaft.4"}
            onClick={() => setCurrentIndex(i)}
        >
            Q{i + 1}
        </Button>
    ));

    return (
        <div className="flex flex-col w-2/12 gap-8">
            <div className="flex flex-col w-full h-fit bg-mine-shaft-800 rounded-xl items-start p-5">
                <div className="w-fit h-fit flex flex-wrap gap-5">
                    {questionButtons}
                </div>
            </div>

            <div className="w-full h-fit">
                <Button
                    w={250}
                    h={50}
                    variant="filled"
                    onClick={onSubmit}
                >
                    <div className="text-xl text-mine-shaft-900 font-bold">
                        Submit
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default QuestionNav