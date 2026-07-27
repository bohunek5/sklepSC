import glob
import re
import os

# Define all possible menu items
MENU_ITEMS = [
    {"id": "start", "href": "index.html", "icon": '<i class="ph ph-house"></i>', "text": "Start"},
    {"id": "sklep", "href": "shop.html", "icon": '<i class="ph ph-squares-four"></i>', "text": "Sklep"},
    {"id": "dobierz", "href": "configurator.html", "icon": '<i class="ph ph-lightbulb-filament"></i>', "text": "Dobierz"},
    {"id": "ai", "href": "ai-shopping.html", "icon": '<img src="images/prescot-pattern.png" class="nav-ai-icon" alt="">', "text": "Zakup AI"},
    {"id": "kontakt", "href": "contact.html", "icon": '<i class="ph ph-envelope-simple"></i>', "text": "Kontakt"}
]

def generate_nav_for_page(current_href):
    # Find the active item
    active_item = next((item for item in MENU_ITEMS if item["href"] == current_href), None)
    
    # If the page isn't in the main menu (e.g. blog.html), default to "Start" as center or just keep Dobierz as center
    if not active_item:
        active_item = MENU_ITEMS[2] # Default to Dobierz in center
        
    # Get the other items
    other_items = [item for item in MENU_ITEMS if item["href"] != active_item["href"]]
    
    # We need 2 on the left, then the active item in the center, then 2 on the right
    left_items = other_items[:2]
    right_items = other_items[2:]
    
    html = '<nav class="new-glass-nav">\n  <div class="mobile-nav-items">\n'
    
    # Add left items
    for item in left_items:
        html += f'''    <a class="mobile-nav-item" href="{item["href"]}">
      {item["icon"]}
      <span>{item["text"]}</span>
    </a>\n'''
        
    # Add center (active) item
    html += f'''    <a class="mobile-nav-item active" href="{active_item["href"]}" style="position:relative;">
      <div class="nav-center-pill">
        {item["icon"] if False else active_item["icon"].replace('class="nav-ai-icon"', 'class="nav-ai-icon active-center-ai" style="filter: brightness(0) invert(1); width:24px; height:24px; margin-bottom:0;"')}
      </div>
      <span style="margin-top:24px;">{active_item["text"]}</span>
    </a>\n'''
    
    # Add right items
    for item in right_items:
        html += f'''    <a class="mobile-nav-item" href="{item["href"]}">
      {item["icon"]}
      <span>{item["text"]}</span>
    </a>\n'''
        
    html += '  </div>\n</nav>'
    return html

def update_all_pages():
    html_files = glob.glob('*.html')
    
    # Regex to match the current new-glass-nav OR mobile-bottom-nav
    nav_pattern_new = re.compile(r'<nav class="new-glass-nav".*?</nav>', re.DOTALL)
    nav_pattern_old = re.compile(r'<nav class="mobile-bottom-nav".*?</nav>', re.DOTALL)
    
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        new_nav = generate_nav_for_page(f)
        
        if nav_pattern_new.search(content):
            content = nav_pattern_new.sub(new_nav, content)
            modified = True
        elif nav_pattern_old.search(content):
            content = nav_pattern_old.sub(new_nav, content)
            modified = True
            
        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated dynamic nav in {f}")

if __name__ == '__main__':
    update_all_pages()
