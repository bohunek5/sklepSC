from playwright.sync_api import sync_playwright
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        
        print("Navigating to index.html...")
        page.goto("http://localhost:3001/index.html")
        page.wait_for_load_state("networkidle")
        
        # Take screenshot of the regular state
        page.screenshot(path="index_menu_default.png")
        print("Took default screenshot.")
        
        # Hover over the dropdown menu item (Sklep)
        print("Hovering over 'Sklep'...")
        sklep_link = page.locator(".has-mega-menu > a").first
        if sklep_link.is_visible():
            sklep_link.hover()
            time.sleep(1)  # wait for animation
            page.screenshot(path="index_dropdown_hover.png")
            print("Took hover screenshot.")
        else:
            print("Could not find '.has-mega-menu > a'")
            
        # Scroll down slightly to trigger sticky header and hover again
        print("Scrolling down...")
        page.evaluate("window.scrollTo(0, 300)")
        time.sleep(1)
        page.screenshot(path="index_menu_scrolled.png")
        
        if sklep_link.is_visible():
            sklep_link.hover()
            time.sleep(1)  # wait for animation
            page.screenshot(path="index_dropdown_scrolled_hover.png")
            print("Took scrolled hover screenshot.")
            
        browser.close()

if __name__ == "__main__":
    main()
