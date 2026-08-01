import shutil

for i in range(1, 37):
    old_index = (i - 1) * 2 + 1
    src = f"images/360/PR-MAD-XX-1224-backup/frame_{old_index}.png"
    dst = f"images/360/PR-MAD-XX-1224/frame_{i}.png"
    shutil.copy(src, dst)

print("Frames successfully remapped from 72 to 36.")
