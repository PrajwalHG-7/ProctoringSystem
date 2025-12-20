from ultralytics import RTDETR

# Load once
rtdetr_model = RTDETR("rtdetr-l.pt")  # or rtdetr-x.pt later

def run_rtdetr(frame):
    results = rtdetr_model.predict(
        source=frame,
        conf=0.4,
        verbose=False
    )

    detections = []

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            cls = int(box.cls[0])

            detections.append({
                "class": cls,
                "conf": conf,
                "bbox": [x1, y1, x2, y2],
                "source": "rtdetr"
            })

    return detections