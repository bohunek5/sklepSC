from PIL import Image

try:
    img = Image.open('images/prescot-pattern.png')
    print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
    
    # Check if the image has any transparent pixels
    if img.mode in ('RGBA', 'LA'):
        extrema = img.getextrema()
        if extrema[-1][0] < 255:
            print("Image has transparency")
        else:
            print("Image does NOT have transparency (it might be a solid block)")
    else:
        print("Image does not have an alpha channel")
except Exception as e:
    print(f"Error: {e}")
