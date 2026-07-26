import os

def fix_index_hero():
    index_path = r"d:\MY-AI-AGENTS\sklepSC\index.html"
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add posters to hero videos
    content = content.replace(
        '<video class="slide-video desktop-bg" muted playsinline preload="auto" src="videos/hero_living_room.mp4"',
        '<video class="slide-video desktop-bg" poster="images/led_living_room.png" muted playsinline preload="auto" src="videos/hero_living_room.mp4"'
    )
    content = content.replace(
        '<video class="slide-video mobile-bg" muted playsinline preload="auto" src="videos/hero_living_room.mp4"',
        '<video class="slide-video mobile-bg" poster="images/led_living_room.png" muted playsinline preload="auto" src="videos/hero_living_room.mp4"'
    )
    
    content = content.replace(
        '<video class="slide-video desktop-bg" muted playsinline preload="auto" src="videos/hero_kitchen.mp4"',
        '<video class="slide-video desktop-bg" poster="images/led_kitchen.png" muted playsinline preload="auto" src="videos/hero_kitchen.mp4"'
    )
    content = content.replace(
        '<video class="slide-video mobile-bg" muted playsinline preload="auto" src="videos/hero_kitchen.mp4"',
        '<video class="slide-video mobile-bg" poster="images/led_kitchen.png" muted playsinline preload="auto" src="videos/hero_kitchen.mp4"'
    )
    
    content = content.replace(
        '<video class="slide-video desktop-bg" muted playsinline preload="auto" src="videos/hero_office.mp4"',
        '<video class="slide-video desktop-bg" poster="images/led_office.png" muted playsinline preload="auto" src="videos/hero_office.mp4"'
    )
    content = content.replace(
        '<video class="slide-video mobile-bg" muted playsinline preload="auto" src="videos/hero_office.mp4"',
        '<video class="slide-video mobile-bg" poster="images/led_office.png" muted playsinline preload="auto" src="videos/hero_office.mp4"'
    )
    
    content = content.replace(
        '<video class="slide-video desktop-bg" muted playsinline preload="auto" src="videos/hero_staircase.mp4"',
        '<video class="slide-video desktop-bg" poster="images/led_staircase.png" muted playsinline preload="auto" src="videos/hero_staircase.mp4"'
    )
    content = content.replace(
        '<video class="slide-video mobile-bg" muted playsinline preload="auto" src="videos/hero_staircase.mp4"',
        '<video class="slide-video mobile-bg" poster="images/led_staircase.png" muted playsinline preload="auto" src="videos/hero_staircase.mp4"'
    )
    
    content = content.replace(
        '<video class="slide-video desktop-bg" muted playsinline preload="auto" src="videos/hero_spa.mp4"',
        '<video class="slide-video desktop-bg" poster="images/cat_spa.png" muted playsinline preload="auto" src="videos/hero_spa.mp4"'
    )
    content = content.replace(
        '<video class="slide-video mobile-bg" muted playsinline preload="auto" src="videos/hero_spa.mp4"',
        '<video class="slide-video mobile-bg" poster="images/cat_spa.png" muted playsinline preload="auto" src="videos/hero_spa.mp4"'
    )

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed index.html hero posters")

fix_index_hero()
