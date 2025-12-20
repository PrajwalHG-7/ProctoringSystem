import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Timer = (props: any) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(0);
    const [handled, setHandled] = useState(false);

    // Initialize timer (minutes → seconds)
    useEffect(() => {
        if (typeof props.time === "number") {
            setTimeLeft(props.time * 60);
        }
    }, [props.time]);

    useEffect(() => {
        if (timeLeft <= 0 || handled) return;

        if (timeLeft === 1) {
            setHandled(true);

            setTimeout(() => {
                alert("Time Up. Test ended.");

                // ✅ Delegate everything to TestPage
                props.onTimeUp && props.onTimeUp();

                navigate("/submit");
            }, 100);

            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, handled, navigate, props.onTimeUp]);

    const formatTime = (sec: number) => {
        if (!sec || sec < 0) return "00:00:00";

        const h = String(Math.floor(sec / 3600)).padStart(2, "0");
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");

        return `${h}:${m}:${s}`;
    };

    return (
        <div className="w-1/3 h-fit flex justify-center">
            <div className="text-bright-sun-500 text-3xl font-bold p-6 text-center min-w-[200px] border-2 border-bright-sun-400 rounded-lg">
                {formatTime(timeLeft)}
            </div>
        </div>
    );
};

export default Timer;