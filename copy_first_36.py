import os
import shutil

source_dir = "images/360/PR-MAD-XX-1224-backup"
dest_dir = "images/360/PR-MAD-XX-1224"

# Clear destination
for filename in os.listdir(dest_dir):
    file_path = os.path.join(dest_dir, filename)
    if os.path.isfile(file_path):
        os.remove(file_path)

# Copy the first 36 frames
for i in range(1, 37):
    src_file = f"frame_{i}.png"
    src_path = os.path.join(source_dir, src_file)
    dest_path = os.path.join(dest_dir, src_file)
    
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
    else:
        print(f"Warning: {src_path} does not exist!")

print(f"Successfully copied the first 36 frames to {dest_dir}.")
