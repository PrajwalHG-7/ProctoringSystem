import os
import cv2
from pycocotools.coco import COCO
from tqdm import tqdm

# ---------------- CONFIG ----------------
IMAGES_DIR = r"C:\Prajwal\Projects\online-test-proctoring-system\ml\datasets\yolo_exam\images\train"
ANNOTATIONS_FILE = r"C:\Prajwal\Projects\online-test-proctoring-system\ml\datasets\yolo_exam\coco_raw\annotations\instances_train2017.json"
OUTPUT_DIR = r"C:\Prajwal\Projects\online-test-proctoring-system\ml\datasets\swin_attention\raw\coco_crops"

MIN_AREA = 32 * 32  # filter tiny person boxes
# ----------------------------------------

os.makedirs(OUTPUT_DIR, exist_ok=True)

coco = COCO(ANNOTATIONS_FILE)

# Get person category id
person_cat_id = coco.getCatIds(catNms=["person"])[0]

# Get all image IDs that contain persons
img_ids = coco.getImgIds(catIds=[person_cat_id])

print(f"[INFO] Total images with persons: {len(img_ids)}")

crop_count = 0

for img_id in tqdm(img_ids, desc="Extracting person crops"):
    img_info = coco.loadImgs(img_id)[0]
    img_path = os.path.join(IMAGES_DIR, img_info["file_name"])

    if not os.path.exists(img_path):
        continue

    image = cv2.imread(img_path)
    if image is None:
        continue

    height, width, _ = image.shape

    ann_ids = coco.getAnnIds(imgIds=[img_id], catIds=[person_cat_id], iscrowd=False)
    anns = coco.loadAnns(ann_ids)

    for idx, ann in enumerate(anns):
        x, y, w, h = ann["bbox"]
        x, y, w, h = map(int, [x, y, w, h])

        if w * h < MIN_AREA:
            continue

        # Clamp to image bounds
        x1 = max(0, x)
        y1 = max(0, y)
        x2 = min(width, x + w)
        y2 = min(height, y + h)

        crop = image[y1:y2, x1:x2]
        if crop.size == 0:
            continue

        out_name = f"{img_info['file_name'].split('.')[0]}_p{idx}.jpg"
        out_path = os.path.join(OUTPUT_DIR, out_name)

        cv2.imwrite(out_path, crop)
        crop_count += 1

print(f"[DONE] Saved {crop_count} person crops to:")
print(OUTPUT_DIR)