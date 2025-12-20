import numpy as np

def crop_region(frame: np.ndarray, bbox, margin=0.15):
    """
    frame: RGB numpy array
    bbox: [x1, y1, x2, y2]
    """
    h, w, _ = frame.shape
    x1, y1, x2, y2 = bbox

    dx = int((x2 - x1) * margin)
    dy = int((y2 - y1) * margin)

    x1 = max(0, x1 - dx)
    y1 = max(0, y1 - dy)
    x2 = min(w, x2 + dx)
    y2 = min(h, y2 + dy)

    return frame[y1:y2, x1:x2]