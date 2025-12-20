from typing import List, Dict

Detection = Dict[str, object]

"""
Detection schema (DO NOT CHANGE later):

{
    "class": "person" | "cell phone",
    "conf": float,
    "bbox": [x1, y1, x2, y2],
    "frame_id": int,
    "source": "yolo" | "rtdetr"
}
"""