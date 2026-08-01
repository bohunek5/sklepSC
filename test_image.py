from PIL import Image
try:
    img = Image.open('images/prescot-pattern-white.png')
    print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
    extrema = img.getextrema()
    print(f"Extrema (min, max) per channel: {extrema}")
    if img.mode == 'RGBA':
        alpha = img.split()[3]
        print(f"Alpha min, max: {alpha.getextrema()}")
except Exception as e:
    print("Error:", e)
