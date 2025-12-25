from ultralytics import YOLO
import numpy as np

# ------------------------------
# Model initialization (ONCE)
# ------------------------------
yolo_model = YOLO("models/yolo_exam_best.pt")

# COCO class IDs we care about
TARGET_CLASSES = {
    0: "person",
    67: "cell phone"
}

def run_yolo(frame: np.ndarray, frame_id: int):
    """
    Run YOLOv8 on a single RGB frame.

    Args:
        frame (np.ndarray): RGB image (H, W, 3)
        frame_id (int): frame index from stream

    Returns:
        List[dict]: unified detection objects
    """

    results = yolo_model.predict(
        source=frame,
        conf=0.25,
        iou=0.5,
        verbose=False
    )

    detections = []

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            cls_id = int(box.cls[0])
            if cls_id not in TARGET_CLASSES:
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])

            detections.append({
                # -------- UNIFIED SCHEMA (FROZEN) --------
                "class": TARGET_CLASSES[cls_id],   # "person" | "cell phone"
                "conf": conf,                      # float (0–1)
                "bbox": [x1, y1, x2, y2],          # pixel coords
                "frame_id": frame_id,              # int
                "source": "yolo"                   # provenance
            })

    return detections