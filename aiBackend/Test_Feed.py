from fastapi import FastAPI, WebSocket
import json
import io
import time
import threading
import numpy as np
from PIL import Image

from yolo_inference import run_yolo
from hybrid_triggers import should_trigger_rtdetr
from rtdetr_inference import run_rtdetr
from crop_utils import crop_region

app = FastAPI()

# --------------------------------------------------
# FRAME BUFFER (LATEST-ONLY POLICY)
# --------------------------------------------------
frame_buffer = []
MAX_BUFFER_SIZE = 8  # keep small to avoid backlog

# --------------------------------------------------
# RT-DETR BACKPRESSURE CONTROL (CRITICAL)
# --------------------------------------------------
rtdetr_lock = threading.Lock()
last_rtdetr_time = 0.0
RTDETR_COOLDOWN = 0.5  # seconds (tune later)

# --------------------------------------------------
# WEBSOCKET ENDPOINT
# --------------------------------------------------
@app.websocket("/ws/video")
async def video_ws(websocket: WebSocket):
    await websocket.accept()
    print("[WS] connection open")

    pending_meta = None
    frame_id = 0

    try:
        while True:
            message = await websocket.receive()

            # -------- TEXT (metadata) --------
            if message.get("text"):
                meta = json.loads(message["text"])
                if meta.get("type") == "frame_meta":
                    pending_meta = meta

            # -------- BINARY (JPEG frame) --------
            elif message.get("bytes"):
                if pending_meta is None:
                    continue

                # Decode JPEG → RGB numpy array
                img = Image.open(io.BytesIO(message["bytes"])).convert("RGB")
                frame = np.array(img)

                print(f"[FRAME] received {frame.shape}, id={frame_id}")

                # Append to buffer (LATEST ONLY)
                frame_buffer.append({
                    "frame_id": frame_id,
                    "timestamp": pending_meta["timestamp"],
                    "frame": frame
                })

                if len(frame_buffer) > MAX_BUFFER_SIZE:
                    frame_buffer.pop(0)

                latest_frame = frame_buffer[-1]["frame"]

                # --------------------------------------------------
                # YOLOv8 — FAST PATH (EVERY FRAME)
                # --------------------------------------------------
                detections = run_yolo(latest_frame, frame_id)

                if detections:
                    print(f"[YOLO] detections @ frame {frame_id}")
                    for d in detections:
                        print(d)

                # --------------------------------------------------
                # RT-DETR — CONDITIONAL, ASYNC, GUARDED
                # --------------------------------------------------
                current_time = time.time()

                if should_trigger_rtdetr(detections, latest_frame.shape):

                    if (
                        not rtdetr_lock.locked()
                        and current_time - last_rtdetr_time > RTDETR_COOLDOWN
                    ):

                        def run_verifier(frame, fid):
                            global last_rtdetr_time
                            with rtdetr_lock:
                                print("[RT-DETR] running verifier")
                                results = run_rtdetr(frame)
                                last_rtdetr_time = time.time()

                                for d in results:
                                    d["frame_id"] = fid
                                    print("[RT-DETR]", d)

                        threading.Thread(
                            target=run_verifier,
                            args=(latest_frame.copy(), frame_id),
                            daemon=True
                        ).start()

                # --------------------------------------------------
                # CROP ADAPTER (FOR SWIN LATER)
                # --------------------------------------------------
                for d in detections:
                    if d["class"] == "person":
                        person_crop = crop_region(latest_frame, d["bbox"])
                        print("[CROP] person crop shape:", person_crop.shape)

                frame_id += 1

    except Exception as e:
        print("[WS] disconnected:", e)