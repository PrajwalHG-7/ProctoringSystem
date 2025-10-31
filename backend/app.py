# backend/main.py

import asyncio
import time
import numpy as np
import cv2
import mediapipe as mp
import threading as th
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS settings for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cheat detection variables
GLOBAL_CHEAT = 0
PERCENTAGE_CHEAT = 0
CHEAT_THRESH = 0.2
HEAD_X_AXIS_CHEAT = 0
HEAD_Y_AXIS_CHEAT = 0
HEAD_X = 0
HEAD_Y = 0
CHEAT_COUNT = 0

# Runtime and communication
RUNNING = False
client_websocket = None
message_queue = asyncio.Queue()


def avg(current, previous):
    if previous > CHEAT_THRESH:
        return 0.05
    if current == 0:
        return previous / 1.01 if previous < 0.01 else previous / 1.01
    if previous == 0:
        return current
    return 1 * previous + 0.1 * current


def process():
    global GLOBAL_CHEAT, PERCENTAGE_CHEAT, CHEAT_COUNT

    while RUNNING:
        if GLOBAL_CHEAT == 0:
            if HEAD_X_AXIS_CHEAT == 0:
                if HEAD_Y_AXIS_CHEAT == 0:
                    PERCENTAGE_CHEAT = avg(0, PERCENTAGE_CHEAT)
                else:
                    PERCENTAGE_CHEAT = avg(0.2, PERCENTAGE_CHEAT)
            else:
                if HEAD_Y_AXIS_CHEAT == 0:
                    PERCENTAGE_CHEAT = avg(0.1, PERCENTAGE_CHEAT)
                else:
                    PERCENTAGE_CHEAT = avg(0.15, PERCENTAGE_CHEAT)
        else:
            if HEAD_X_AXIS_CHEAT == 0:
                if HEAD_Y_AXIS_CHEAT == 0:
                    PERCENTAGE_CHEAT = avg(0, PERCENTAGE_CHEAT)
                else:
                    PERCENTAGE_CHEAT = avg(0.55, PERCENTAGE_CHEAT)
            else:
                if HEAD_Y_AXIS_CHEAT == 0:
                    PERCENTAGE_CHEAT = avg(0.6, PERCENTAGE_CHEAT)
                else:
                    PERCENTAGE_CHEAT = avg(0.5, PERCENTAGE_CHEAT)

        cheat_now = PERCENTAGE_CHEAT >= CHEAT_THRESH
        GLOBAL_CHEAT = 1 if cheat_now else 0

        if cheat_now:
            CHEAT_COUNT += 1

        data = {
            "cheat": cheat_now,
            "cheat_count": CHEAT_COUNT,
            "cheat_percentage": round(PERCENTAGE_CHEAT, 3)
        }

        print(f"Cheat %: {PERCENTAGE_CHEAT:.3f} | Count: {CHEAT_COUNT} {'--> CHEATING' if cheat_now else ''}")
        # Send to WebSocket
        if client_websocket:
            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            asyncio.run_coroutine_threadsafe(message_queue.put(data), loop)

        time.sleep(0.2)


def pose():
    global HEAD_X, HEAD_Y, HEAD_X_AXIS_CHEAT, HEAD_Y_AXIS_CHEAT

    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    cap = cv2.VideoCapture(0)
    mp_drawing = mp.solutions.drawing_utils
    face_ids = [33, 263, 1, 61, 291, 199]

    while cap.isOpened() and RUNNING:
        success, image = cap.read()
        if not success:
            break

        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = face_mesh.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        img_h, img_w, _ = image.shape
        face_3d = []
        face_2d = []

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_CONTOURS
                )

                for idx, lm in enumerate(face_landmarks.landmark):
                    if idx in face_ids:
                        if idx == 1:
                            nose_2d = (lm.x * img_w, lm.y * img_h)
                            nose_3d = (lm.x * img_w, lm.y * img_h, lm.z * 8000)
                        x, y = int(lm.x * img_w), int(lm.y * img_h)
                        face_2d.append([x, y])
                        face_3d.append([x, y, lm.z])

                face_2d = np.array(face_2d, dtype=np.float64)
                face_3d = np.array(face_3d, dtype=np.float64)

                focal_length = 1 * img_w
                cam_matrix = np.array([[focal_length, 0, img_h / 2],
                                       [0, focal_length, img_w / 2],
                                       [0, 0, 1]])
                dist_matrix = np.zeros((4, 1), dtype=np.float64)

                success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
                rmat, _ = cv2.Rodrigues(rot_vec)
                angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

                HEAD_X = angles[0] * 360
                HEAD_Y = angles[1] * 360

                HEAD_X_AXIS_CHEAT = 1 if abs(HEAD_Y) > 10 else 0
                HEAD_Y_AXIS_CHEAT = 1 if HEAD_X < -5 else 0

                cv2.putText(image, f"{int(HEAD_X)}::{int(HEAD_Y)}", (20, 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        else:
            print("⚠️ No face detected — possible cheating!")
            HEAD_X_AXIS_CHEAT = 1
            HEAD_Y_AXIS_CHEAT = 1
            cv2.putText(image, "No Face Detected - CHEATING", (20, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)

        cv2.imshow('Head Pose Estimation', image)
        if cv2.waitKey(5) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


@app.get("/start")
def start_cheating_detection():
    global RUNNING, CHEAT_COUNT
    if not RUNNING:
        CHEAT_COUNT = 0
        RUNNING = True
        th.Thread(target=pose, daemon=True).start()
        th.Thread(target=process, daemon=True).start()
        return {"status": "Cheating detection started"}
    return {"status": "Already running"}


@app.get("/stop")
def stop_cheating_detection():
    global RUNNING
    RUNNING = False
    return {"status": "Cheating detection stopped"}


@app.get("/restart")
def restart_cheating_detection():
    global RUNNING
    RUNNING = False
    time.sleep(1)
    return start_cheating_detection()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global client_websocket
    await websocket.accept()
    print("WebSocket connected")
    client_websocket = websocket
    try:
        while True:
            data = await message_queue.get()
            await websocket.send_json(data)
            
            
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
        client_websocket = None