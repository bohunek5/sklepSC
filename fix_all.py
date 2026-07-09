import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Footer Logo & Filter
    # Remove filter: brightness(0) invert(1);
    content = re.sub(r'filter:\s*brightness\(0\)\s*invert\(1\);', '', content)
    # Ensure logo source is /images/logo.png
    content = re.sub(r'<img src="/images/logo(?:-white|-dark)?\.png" alt="Cooken Logo White">', '<img src="/images/logo.png" alt="Prescot Logo" style="height: 35px; max-width: 100%;">', content)
    
    # 2. Update Footer text color
    content = re.sub(r'color:\s*#888;', 'color: #ccc;', content)
    
    # 3. Update Footer Bottom Text
    content = content.replace('Stworzone przez Antigravity dla Bohunek', 'Powered by PRESCOT LED')
    
    # 4. Add company address if not present
    if 'PRESCOT LED' in content and 'ul.' not in content[content.find('<div class="footer-col">'):content.find('</div>', content.find('<div class="footer-col">'))]:
        content = content.replace(
            'Prescot LED to profesjonalny dostawca najwyższej jakości taśm LED, profili aluminiowych, nowoczesnych sterowników oraz niezawodnych zasilaczy hermetycznych.</p>',
            'Prescot LED to profesjonalny dostawca najwyższej jakości taśm LED, profili aluminiowych, nowoczesnych sterowników oraz niezawodnych zasilaczy hermetycznych.</p><p style="margin-top: 15px; color: #ccc;"><strong>PRESCOT LED</strong><br>ul. Przykładowa 12<br>00-001 Warszawa<br>kontakt@prescot.com.pl</p>'
        )

    # 5. Product Badges Sale/New -> TOP
    content = re.sub(r'<span class="mockup-product-badge" style="background-color: var\(--accent-color\);">Sale</span>', '<span class="mockup-product-badge" style="background-color: var(--accent-color);">TOP</span>', content)
    content = re.sub(r'<span class="mockup-product-badge"[^>]*>New</span>', '<span class="mockup-product-badge" style="background-color: var(--primary-color);">TOP</span>', content)

    # 6. Hero H1 style on subpages
    content = re.sub(r'<h1 style="color:\s*#fff;\s*font-size:\s*42px;\s*margin-bottom:\s*10px;\s*text-transform:\s*uppercase;\s*letter-spacing:\s*2px;">', '<h1 style="color: #fff; font-size: 64px; font-weight: 800; font-family: \'Outfit\', sans-serif; margin-bottom: 10px; text-transform: uppercase; letter-spacing: -1px; text-shadow: 0 4px 12px rgba(0,0,0,0.3);">', content)
    content = re.sub(r'<h1 style="color:\s*#fff;\s*font-size:\s*42px;\s*margin-bottom:\s*10px;\s*text-transform:\s*uppercase;">', '<h1 style="color: #fff; font-size: 64px; font-weight: 800; font-family: \'Outfit\', sans-serif; margin-bottom: 10px; text-transform: uppercase; letter-spacing: -1px; text-shadow: 0 4px 12px rgba(0,0,0,0.3);">', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Batch 1 done")
