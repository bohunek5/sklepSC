import shutil
import os
import glob

brain_dir = r"C:\Users\Karol Bohdanowicz\.gemini\antigravity-ide\brain\b6aadb02-3a07-4767-9e45-74a782c718c8"
target_dir = r"d:\MY-AI-AGENTS\sklepSC\images"

patterns = [
    "led_living_room_*.png",
    "led_kitchen_*.png",
    "led_staircase_*.png",
    "led_office_*.png",
    "led_showroom_*.png",
    "led_facade_*.png"
]

mapping = {
    "led_living_room": "led_living_room.png",
    "led_kitchen": "led_kitchen.png",
    "led_staircase": "led_staircase.png",
    "led_office": "led_office.png",
    "led_showroom": "led_showroom.png",
    "led_facade": "led_facade.png"
}

for pattern in patterns:
    files = glob.glob(os.path.join(brain_dir, pattern))
    if files:
        # get the latest one if multiple
        files.sort(key=os.path.getmtime, reverse=True)
        source = files[0]
        
        # Determine target name based on prefix
        for key in mapping:
            if key in source:
                target_path = os.path.join(target_dir, mapping[key])
                shutil.copy2(source, target_path)
                print(f"Copied {os.path.basename(source)} to {mapping[key]}")
                break
