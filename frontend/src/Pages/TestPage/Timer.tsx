import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Timer = ({ time }: { time?: number }) => {
    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState(0);
    const [timeUpHandled, setTimeUpHandled] = useState(false);

    useEffect(() => {
        if (time !== undefined && time !== null) {
            setTimeLeft(time * 60);
        }
    }, [time]);

    useEffect(() => {
        if (timeLeft <= 0 || timeLeft === null) return;

        if (timeLeft === 0 && !timeUpHandled) {
            setTimeUpHandled(true);

            window.cameraStream?.getTracks().forEach(track => track.stop());
            delete window.cameraStream;

            setTimeout(() => {
                alert("Time Up, Test ended");
                navigate('/submit');
                window.location.reload();
            }, 100);

            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, timeUpHandled, navigate]);

    const formatTime = (totalSeconds: number) => {
        if (!totalSeconds || isNaN(totalSeconds)) return "00:00:00";

        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const secs = String(totalSeconds % 60).padStart(2, "0");

        return `${hrs}:${mins}:${secs}`;
    };

    return (
        <div className="w-1/3 h-fit flex justify-center">
            <div className="text-bright-sun-500 text-3xl font-bold p-6 text-center w-fit border-2 border-bright-sun-400 rounded-lg">
                {formatTime(timeLeft)}
            </div>
        </div>
    );
};

export default Timer;