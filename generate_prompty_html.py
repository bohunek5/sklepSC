import shutil
import os
import glob
import codecs

brain_dir = r"C:\Users\Karol Bohdanowicz\.gemini\antigravity-ide\brain\b6aadb02-3a07-4767-9e45-74a782c718c8"
target_img_dir = r"d:\MY-AI-AGENTS\sklepSC\images"
workspace = r"d:\MY-AI-AGENTS\sklepSC"

# 1. Copy images
def copy_latest(pattern, dest_name):
    files = glob.glob(os.path.join(brain_dir, pattern))
    if files:
        files.sort(key=os.path.getmtime, reverse=True)
        shutil.copy2(files[0], os.path.join(target_img_dir, dest_name))
        print(f"Copied {dest_name}")

copy_latest("led_shop_hero_*.png", "led_shop_hero.png")
cats = ["cat_living", "cat_kitchen", "cat_bathroom", "cat_stairs", "cat_garden", "cat_office", "cat_showroom", "cat_bedroom"]
for cat in cats:
    copy_latest(f"{cat}_*.png", f"{cat}.png")

# 2. Update shop.html
shop_path = os.path.join(workspace, "shop.html")
with codecs.open(shop_path, 'r', 'utf-8') as f:
    html = f.read()
html = html.replace("url('images/led_kitchen.png')", "url('images/led_shop_hero.png')")
with codecs.open(shop_path, 'w', 'utf-8') as f:
    f.write(html)
print("Updated shop.html")

# 3. Create prompty.html
prompty_html = """<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompty do Video AI</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0b1a30; color: #fff; padding: 40px; margin: 0; }
        h1 { text-align: center; color: #e14f27; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; margin-top: 40px; }
        .card { background: #162846; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .card img { width: 100%; height: 250px; object-fit: cover; border-bottom: 3px solid #e14f27; }
        .content { padding: 20px; }
        .content h2 { margin-top: 0; font-size: 20px; color: #f8fafc; }
        .prompt-box { background: #0b1a30; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #94a3b8; border: 1px solid #334155; margin-bottom: 15px; user-select: all; }
        .copy-btn { background: #e14f27; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; transition: background 0.2s; }
        .copy-btn:hover { background: #ff5a30; }
    </style>
</head>
<body>
    <h1>Gotowe Prompty Video (AI Ultra)</h1>
    <p style="text-align: center; color: #94a3b8;">Kliknij przycisk Kopiuj pod wybranym obrazkiem i wklej do Google Labs / Luma.</p>
    
    <div class="grid">
        <!-- 1 -->
        <div class="card">
            <img src="images/cat_living.png" alt="Living Room">
            <div class="content">
                <h2>1. Salon (Ciepłe światło)</h2>
                <div class="prompt-box" id="p1">A slow, cinematic tracking shot of a luxurious modern living room at night. Perfectly straight, seamless, glowing warm orange LED light lines (3000K) run across the ceiling and dark slate walls. The glowing light lines cast soft shadows. Volumetric lighting, 8k resolution, photorealistic real-estate video.</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('p1').innerText); this.innerText='Skopiowano!'; setTimeout(() => this.innerText='Kopiuj Prompt', 2000);">Kopiuj Prompt</button>
            </div>
        </div>
        
        <!-- 2 -->
        <div class="card">
            <img src="images/cat_kitchen.png" alt="Kitchen">
            <div class="content">
                <h2>2. Kuchnia (Zimny luksus)</h2>
                <div class="prompt-box" id="p2">A smooth dolly-in camera movement in a hyper-modern minimalist kitchen. Seamless cool white (6000K) continuous LED strips are embedded flush within the matte black cabinetry and the edges of the marble island. Photorealistic ray-traced reflections on the marble, highly detailed 8k architectural visualization.</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('p2').innerText); this.innerText='Skopiowano!'; setTimeout(() => this.innerText='Kopiuj Prompt', 2000);">Kopiuj Prompt</button>
            </div>
        </div>

        <!-- 3 -->
        <div class="card">
            <img src="images/cat_bathroom.png" alt="Bathroom">
            <div class="content">
                <h2>3. Łazienka SPA (Neutralne)</h2>
                <div class="prompt-box" id="p3">A cinematic, moody pan across a luxurious modern spa bathroom clad in dark marble. A flawless continuous glowing LED line (4000K neutral white) frames the large vanity mirror and illuminates the sleek shower niche. Atmospheric steam slowly rising in the background, extreme realism, ray tracing, 8k.</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('p3').innerText); this.innerText='Skopiowano!'; setTimeout(() => this.innerText='Kopiuj Prompt', 2000);">Kopiuj Prompt</button>
            </div>
        </div>

        <!-- 4 -->
        <div class="card">
            <img src="images/cat_stairs.png" alt="Stairs">
            <div class="content">
                <h2>4. Schody (Wbudowane stopnie)</h2>
                <div class="prompt-box" id="p4">A slow upward tilting architectural shot of a grand modern staircase made of floating dark walnut wood. Underneath every single step, a flawless, continuous glowing line of neutral white LED light (4000K) illuminates the path, casting dramatic shadows. Cinematic real-estate video tour.</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('p4').innerText); this.innerText='Skopiowano!'; setTimeout(() => this.innerText='Kopiuj Prompt', 2000);">Kopiuj Prompt</button>
            </div>
        </div>

        <!-- 5 -->
        <div class="card">
            <img src="images/cat_garden.png" alt="Garden">
            <div class="content">
                <h2>5. Ogród / Zewnątrz (Zmierzch)</h2>
                <div class="prompt-box" id="p5">A smooth drone-style tracking shot of a modern luxury villa exterior and garden at twilight. The dark architecture and pathway are dramatically highlighted by razor-sharp, continuous glowing LED lines (3000K warm white) embedded in the concrete. Cinematic twilight sky, premium real estate, photorealistic motion.</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('p5').innerText); this.innerText='Skopiowano!'; setTimeout(() => this.innerText='Kopiuj Prompt', 2000);">Kopiuj Prompt</button>
            </div>
        </div>

        <!-- 6 -->
        <div class="card">
            <img src="images/cat_office.png" alt="Office">
            <div class="content">
                <h2>6. Biuro / Przestrzeń Pracy</h2>
                <div class="prompt-box" id="p6">A slow pan inside a premium modern office interior. Sleek, perfectly straight LED light lines (4000K neutral white) run seamlessly across the acoustic slatted wood ceiling and down the dark concrete walls. The space features high-end modern furniture and a moody, professional atmosphere. Cinematic lighting, architectural 8k video.</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('p6').innerText); this.innerText='Skopiowano!'; setTimeout(() => this.innerText='Kopiuj Prompt', 2000);">Kopiuj Prompt</button>
            </div>
        </div>

        <!-- 7 -->
        <div class="card">
            <img src="images/cat_showroom.png" alt="Showroom">
            <div class="content">
                <h2>7. Sklep / Showroom</h2>
                <div class="prompt-box" id="p7">A slow tracking shot through a luxurious retail showroom. Continuous, ultra-bright LED lighting lines (6000K cool white) trace the sharp geometric contours of the minimalist space, reflecting beautifully off the dark polished floors. The lighting is pristine and seamless. Extreme detail, moody, premium atmosphere.</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('p7').innerText); this.innerText='Skopiowano!'; setTimeout(() => this.innerText='Kopiuj Prompt', 2000);">Kopiuj Prompt</button>
            </div>
        </div>

        <!-- 8 -->
        <div class="card">
            <img src="images/cat_bedroom.png" alt="Bedroom">
            <div class="content">
                <h2>8. Sypialnia (Światło Nastrojowe)</h2>
                <div class="prompt-box" id="p8">A cinematic, very slow push-in shot of a luxurious moody master bedroom at night. Hidden, seamless warm LED strip lights (2700K) create a soft glowing halo behind the massive upholstered headboard and underneath the floating bed. Deep cinematic shadows, elegant atmosphere, ray tracing, 8k.</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('p8').innerText); this.innerText='Skopiowano!'; setTimeout(() => this.innerText='Kopiuj Prompt', 2000);">Kopiuj Prompt</button>
            </div>
        </div>
    </div>
</body>
</html>
"""

with codecs.open(os.path.join(workspace, 'prompty.html'), 'w', 'utf-8') as f:
    f.write(prompty_html)
print("Created prompty.html")
