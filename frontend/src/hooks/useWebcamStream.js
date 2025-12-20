import { useEffect, useRef, useCallback } from "react";

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 15;

export function useWebcamStream(wsUrl) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const socketRef = useRef(null);
    const streamRef = useRef(null);

    const runningRef = useRef(true);
    const frameIdRef = useRef(0);
    const sendingRef = useRef(false);

    /* --------------------------------------------------
       CLEANUP — HARD STOP
    -------------------------------------------------- */
    const cleanup = useCallback(() => {
        runningRef.current = false;

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (socketRef.current) {
            try {
                if (
                    socketRef.current.readyState === WebSocket.OPEN ||
                    socketRef.current.readyState === WebSocket.CONNECTING
                ) {
                    socketRef.current.close(1000, "Client cleanup");
                }
            } catch (_) { }

            socketRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        console.log("[Webcam] cleanup completed (hard stop)");
    }, []);

    /* --------------------------------------------------
       INIT CAMERA + SOCKET
    -------------------------------------------------- */
    useEffect(() => {
        let socket;

        async function init() {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { exact: WIDTH },
                    height: { exact: HEIGHT },
                    frameRate: { ideal: FPS, max: FPS }
                },
                audio: false
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(() => { });
            }

            socket = new WebSocket(wsUrl);
            socket.binaryType = "arraybuffer";

            socket.onopen = () => {
                socketRef.current = socket;
                console.log("[WS] connected");
            };

            socket.onclose = (e) => {
                console.log("[WS] closed", e.code, e.reason);
            };

            socket.onerror = (e) => {
                console.error("[WS] error", e);
            };
        }

        init();
        return () => cleanup();
    }, [wsUrl, cleanup]);

    /* --------------------------------------------------
       FRAME LOOP (CORRECT RAF LOGIC)
    -------------------------------------------------- */
    useEffect(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const interval = 1000 / FPS;
        let lastTime = 0;

        const loop = async (time) => {
            if (!runningRef.current) return;

            // Always reschedule
            requestAnimationFrame(loop);

            if (!socketRef.current) return;
            if (socketRef.current.readyState !== WebSocket.OPEN) return;
            if (sendingRef.current) return;

            if (time - lastTime < interval) return;

            lastTime = time;
            sendingRef.current = true;

            try {
                const bitmap = await createImageBitmap(video);
                ctx.drawImage(bitmap, 0, 0, WIDTH, HEIGHT);
                bitmap.close();

                canvas.toBlob(async (blob) => {
                    if (
                        !blob ||
                        !socketRef.current ||
                        socketRef.current.readyState !== WebSocket.OPEN
                    ) {
                        sendingRef.current = false;
                        return;
                    }

                    const buffer = await blob.arrayBuffer();
                    const frameId = frameIdRef.current++;

                    socketRef.current.send(JSON.stringify({
                        type: "frame_meta",
                        frame_id: frameId,
                        timestamp: performance.now(),
                        width: WIDTH,
                        height: HEIGHT,
                        encoding: "jpeg"
                    }));

                    socketRef.current.send(buffer);
                    sendingRef.current = false;
                }, "image/jpeg", 0.8);
            } catch (_) {
                sendingRef.current = false;
            }
        };

        requestAnimationFrame(loop);
    }, []);

    /* --------------------------------------------------
       PUBLIC API
    -------------------------------------------------- */
    return {
        videoRef,
        canvasRef,
        cleanup
    };
}