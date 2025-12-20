import React, { forwardRef, useImperativeHandle } from "react";
import { useWebcamStream } from "../../hooks/useWebcamStream";

const WS_URL = "ws://localhost:8000/ws/video";

export type CameraHandle = {
    cleanup: () => void;
};

const Camera = forwardRef<CameraHandle>((_, ref) => {
    const {
        videoRef,
        canvasRef,
        cleanup, // ⬅ exposed from hook
    } = useWebcamStream(WS_URL);

    // Expose cleanup to parent (TestPage)
    useImperativeHandle(ref, () => ({
        cleanup,
    }));

    return (
        <div className="w-1/3 flex justify-end pr-9">
            <div className="text-bright-sun-500 text-3xl font-bold text-center w-fit border-2 border-bright-sun-400 rounded-lg">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                        maxHeight: "87px",
                        minHeight: "72px",
                        minWidth: "128px",
                        maxWidth: "128px",
                        borderRadius: "7px",
                    }}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
        </div>
    );
});

export default Camera