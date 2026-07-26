import os
import re

def fix_configurator_images():
    cfg_path = r"d:\MY-AI-AGENTS\sklepSC\configurator.html"
    with open(cfg_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the images for the 4 white choices so they are distinct
    
    # 1. Warm White (Ciepła biel)
    content = re.sub(
        r'(<label[^>]*light-warm[^>]*style="--choice-image:url\()\'.*?\'(\);)',
        r"\1'images/cat_bedroom.png'\2",
        content
    )
    # 2. Neutral White (Neutralna biel)
    content = re.sub(
        r'(<label[^>]*light-neutral[^>]*style="--choice-image:url\()\'.*?\'(\);)',
        r"\1'images/cat_kitchen.png'\2",
        content
    )
    # 3. Cold White (Zimna biel)
    content = re.sub(
        r'(<label[^>]*light-cold[^>]*style="--choice-image:url\()\'.*?\'(\);)',
        r"\1'images/cat_office.png'\2",
        content
    )
    # 4. CCT (Biel regulowana CCT) -> it doesn't have a specific subclass, but it is the FIRST one after light-cold
    # We can match 'Biel regulowana CCT' string
    
    # Actually, we can just replace the specific URLs I put in there last time:
    content = content.replace("url('images/products/tasma_3000k.webp')", "url('images/cat_bedroom.png')")
    content = content.replace("url('images/configurator/light_cold_new.png')", "url('images/cat_kitchen.png')")
    content = content.replace("url('images/hero_mono.webp')", "url('images/cat_office.png')")
    content = content.replace("url('images/hero_cct.webp')", "url('images/cat_living.png')")

    with open(cfg_path, 'w', encoding='utf-8') as f:
        f.write(content)
        print("Fixed configurator images")

if __name__ == '__main__':
    fix_configurator_images()
