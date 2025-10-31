import { useEffect, useState } from "react";
import { StartBackend } from "../../Services/BackendSwitch";
import useCheatData, { connectWS, closeWS } from "../../Services/CheatData";
import CheatAlert from "./CheatAlert";
import Instructions from "./Instructions";
import Questions from "./Questions";
import Timer from "./Timer";
import QuestionNav from "./QuestionNav";

const TestPage = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [backendStarted, setBackendStarted] = useState(false);

    const { cheat, cheat_count, cheat_percentage } = useCheatData(backendStarted);

    // Poll to check WebSocket readiness
    const waitForWebSocket = async (): Promise<void> => {
        return new Promise((resolve) => {
            const tryConnect = () => {
                const testSocket = new WebSocket("ws://127.0.0.1:8000/ws");

                testSocket.onopen = () => {
                    console.log("WebSocket is ready ✅");
                    testSocket.close();
                    resolve();
                };

                testSocket.onerror = () => {
                    console.log("Waiting for WebSocket...");
                    setTimeout(tryConnect, 500); // Retry in 500ms
                };
            };

            tryConnect();
        });
    };

    useEffect(() => {
        StartBackend()
            .then(async () => {
                console.log("Backend started successfully");
                await waitForWebSocket(); // Wait until WebSocket is available
                setBackendStarted(true);  // This triggers connectWS inside useCheatData
            })
            .catch((err) => {
                console.error("Backend start failed", err);
            });

        return () => {
            closeWS();
        };
    }, []);

    useEffect(() => {
        console.log(cheat)
        if (cheat) {
            setShowAlert(true);
            const timeout = setTimeout(() => {
                setShowAlert(false);
            }, 10000);

            return () => clearTimeout(timeout);
        }
    }, [cheat]);

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
        <div className="flex flex-col gap-10">
            <div className="flex justify-center">
                <Timer />
            </div>
            <div className="flex px-4 justify-around">
                <Instructions />
                <Questions />
                <QuestionNav />
            </div>
        </div>
    );
};

export default TestPage;