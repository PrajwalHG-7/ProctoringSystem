def should_trigger_rtdetr(detections, frame_shape):
    """
    Decide whether RT-DETR should run on this frame
    """

    for d in detections:
        if d["class"] == "cell phone":
            # Trigger 1: low-confidence phone
            if 0.35 <= d["conf"] <= 0.65:
                return True

        if d["class"] == "person":
            # Trigger 2: unstable person confidence
            if d["conf"] < 0.5:
                return True

    return False