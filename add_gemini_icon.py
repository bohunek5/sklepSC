import os
import re

gemini_svg = '<svg class="gemini-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-left:4px; margin-bottom:2px;"><path d="M12 0L14.645 9.355L24 12L14.645 14.645L12 24L9.355 14.645L0 12L9.355 9.355L12 0Z"/></svg>'

html_files = [
    'about.html', 'admin.html', 'blog.html', 'cart.html', 'checkout.html',
    'configurator.html', 'contact.html', 'index.html', 'product.html', 'shop.html', 'ai-shopping.html'
]

for file in html_files:
    filepath = 'd:/MY-AI-AGENTS/sklepSC/' + file
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace "Zakup AI ✨" with "Zakup AI <svg...>"
    if 'Zakup AI ✨' in html:
        html = html.replace('Zakup AI ✨', f'Zakup AI {gemini_svg}')

    # Also update the AI avatar in ai-shopping.html to use the Gemini icon
    if file == 'ai-shopping.html':
        old_avatar = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path><path d="M12 12 2.1 22"></path><path d="M12 12 21.9 2"></path></svg>'
        new_avatar = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.645 9.355L24 12L14.645 14.645L12 24L9.355 14.645L0 12L9.355 9.355L12 0Z"/></svg>'
        html = html.replace(old_avatar, new_avatar)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {file}")
