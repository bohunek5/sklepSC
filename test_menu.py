from playwright.sync_api import sync_playwright
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 800})
        page.goto("http://localhost:3001/shop.html")
        
        # Wait for load
        page.wait_for_timeout(1000)
        
        # Take initial screenshot
        page.screenshot(path="shop_header_initial.png")
        print("Took initial screenshot")
        
        # Find 'Sklep' link
        # It's inside a li with class has-mega-menu
        mega_menu = page.locator("li.has-mega-menu").first
        
        if mega_menu:
            mega_menu.hover()
            page.wait_for_timeout(1000)
            page.screenshot(path="shop_header_hover.png")
            print("Took hover screenshot")
            
            # Check if magic-dropdown is visible
            dropdown = mega_menu.locator(".magic-dropdown")
            print("Dropdown visible:", dropdown.is_visible())
            
        browser.close()

if __name__ == "__main__":
    main()
