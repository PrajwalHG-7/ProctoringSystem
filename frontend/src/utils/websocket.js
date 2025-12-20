let socket = null;

export function connectWebSocket(url) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
    }

    socket = new WebSocket(url);
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
        console.log("[WS] Connected");
    };

    socket.onerror = (err) => {
        console.error("[WS] Error", err);
    };

    socket.onclose = () => {
        console.log("[WS] Closed");
        socket = null;
    };

    return socket;
}

export function getSocket() {
    return socket;
}