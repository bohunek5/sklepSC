import os
import re

def fix_subpage_heroes():
    root_dir = r"d:\MY-AI-AGENTS\sklepSC"
    html_files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    
    for file in html_files:
        filepath = os.path.join(root_dir, file)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            continue
            
        modified = False
        
        # Fix backslashes in background URLs
        # Find occurrences like: background: url(\'images/led_office.png\')
        if r"\'images/" in content or r"\'images" in content:
            content = content.replace(r"\'images/", "'images/")
            modified = True
            
        # specifically check for pattern like: url(\'images/led_office.png\')
        if r"\')" in content:
            content = content.replace(r"\')", "')")
            modified = True
            
        # Fix configurator light images
        if file == 'configurator.html':
            # Ciepla biel
            content = content.replace(
                "url('images/configurator/light_warm_new.png')", 
                "url('images/products/tasma_3000k.webp')"
            )
            # Neutralna biel gets the old cold white image
            content = content.replace(
                "url('images/configurator/light_neutral_new.png')", 
                "url('images/configurator/light_cold_new.png')"
            )
            # Zimna biel gets hero_mono (real photo)
            # First, we need a distinct pattern because we just changed neutral to use light_cold_new.png
            # Oh wait, if we do replace in order, it might mess up if they match!
            # Let's use regex for safety on the exact label
            pass
            
        if modified and file != 'configurator.html': # We will handle configurator separately to be safe
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                print(f"Fixed {file}")

def fix_configurator():
    cfg_path = r"d:\MY-AI-AGENTS\sklepSC\configurator.html"
    with open(cfg_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Warm
    content = re.sub(
        r'(<label[^>]*light-warm[^>]*style="--choice-image:url\()\'images/configurator/light_warm_new.png\'(\);)',
        r"\1'images/products/tasma_3000k.webp'\2",
        content
    )
    # 2. Neutral (use the old cold white)
    content = re.sub(
        r'(<label[^>]*light-neutral[^>]*style="--choice-image:url\()\'images/configurator/light_neutral_new.png\'(\);)',
        r"\1'images/configurator/light_cold_new.png'\2",
        content
    )
    # 3. Cold (use hero_mono)
    content = re.sub(
        r'(<label[^>]*light-cold[^>]*style="--choice-image:url\()\'images/configurator/light_cold_new.png\'(\);)',
        r"\1'images/hero_mono.webp'\2",
        content
    )
    # 4. CCT
    content = re.sub(
        r'(<label[^>]*light-choice[^>]*style="--choice-image:url\()\'images/configurator/light_cct_new.png\'(\);)',
        r"\1'images/hero_cct.webp'\2",
        content
    )
    # 5. RGB
    content = re.sub(
        r'(<label[^>]*light-choice[^>]*style="--choice-image:url\()\'images/configurator/light_rgb_new.png\'(\);)',
        r"\1'images/hero_rgb.webp'\2",
        content
    )
    # 6. RGBW
    content = re.sub(
        r'(<label[^>]*light-choice[^>]*style="--choice-image:url\()\'images/configurator/light_rgbw_new.png\'(\);)',
        r"\1'images/hero_rgbcct.webp'\2",
        content
    )
    
    # Fix backslashes in configurator as well
    content = content.replace(r"\'images/", "'images/").replace(r"\')", "')")
    
    with open(cfg_path, 'w', encoding='utf-8') as f:
        f.write(content)
        print("Fixed configurator.html")

fix_subpage_heroes()
fix_configurator()
