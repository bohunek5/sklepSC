from PIL import Image

try:
    img = Image.open('images/prescot-pattern.png')
    # Resize it down and save as white silhouette
    img = img.resize((48, 48))
    
    # Check if we can make a white version that looks right in CSS
    out = Image.new('RGBA', img.size, (255, 255, 255, 0))
    for x in range(img.width):
        for y in range(img.height):
            r, g, b, a = img.getpixel((x, y))
            if a > 0:
                # If there's any opacity, make it white with that opacity
                out.putpixel((x, y), (255, 255, 255, a))
    
    out.save('images/prescot-pattern-white.png')
    print("Created images/prescot-pattern-white.png")
except Exception as e:
    print(f"Error: {e}")
