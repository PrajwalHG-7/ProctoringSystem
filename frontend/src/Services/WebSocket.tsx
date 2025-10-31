let socket: WebSocket | null = null;

export interface CheatData {
    cheat: boolean;
    cheat_count: number;
    cheat_percentage: number;
}

export function connectWS(onData: (data: CheatData) => void) {
    socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onopen = () => {
        console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onData(data);
    };

    socket.onclose = () => {
        console.log("🛑 WebSocket closed");
    };

    socket.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
    };
}

export function closeWS() {
    if (socket) {
        socket.close();
        socket = null;
    }
}