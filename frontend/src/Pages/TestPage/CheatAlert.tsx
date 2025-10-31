import { Button } from "@mantine/core";

type Props = {
    cheatCount: number;
    cheatPercentage: number;
    onResume: () => void;
};

const CheatAlert = ({ cheatCount, cheatPercentage, onResume }: Props) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
            <div className="bg-mine-shaft-500 p-8 rounded-xl shadow-lg text-center space-y-4">
                <h2 className="text-xl font-bold text-red-600">Cheating Detected!</h2>
                <p>Cheat Count: {cheatCount}</p>
                <p>Cheat Percentage: {cheatPercentage}%</p>
                <Button onClick={onResume} variant="filled"><div className="text-xl text-mine-shaft-950 font-bold">Resume</div></Button>
            </div>
        </div>
    );
};

export default CheatAlert;
