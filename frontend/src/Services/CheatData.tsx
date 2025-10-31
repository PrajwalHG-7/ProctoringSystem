// CheatData.ts
import { useEffect, useState } from "react";

export type cheatData = {
    cheat: boolean;
    cheat_count: number;
    cheat_percentage: number;
};

let ws: WebSocket | null = null;

export const connectWS = (onMessage: (data: cheatData) => void) => {
    ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onopen = () => {
        console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };

    ws.onerror = (err) => {
        console.error("WebSocket error", err);
    };

    ws.onclose = () => {
        console.log("WebSocket closed");
    };
};

export const closeWS = () => {
    if (ws) {
        ws.close();
    }
};

const useCheatData = (backendStarted: boolean) => {
    const [cheat, setCheat] = useState(false);
    const [cheat_count, setCheatCount] = useState(0);
    const [cheat_percentage, setCheatPercentage] = useState(0);

    useEffect(() => {
        if (backendStarted) {
            console.log("Backend Started?: " ,backendStarted)
            connectWS((data: cheatData) => {
                setCheat(data.cheat);
                setCheatCount(data.cheat_count);
                setCheatPercentage(data.cheat_percentage);
                console.log("Cheated?: " ,data.cheat)

            });
        }

        
    }, [backendStarted]);

    return { cheat, cheat_count, cheat_percentage };
};

export default useCheatData;