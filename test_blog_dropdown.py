from playwright.sync_api import sync_playwright
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": 1200, "height": 800})
        page.goto("http://localhost:3001/blog.html")
        time.sleep(1)
        page.screenshot(path="blog_menu_default.png")
        
        # Hover Sklep
        page.hover("text=Sklep")
        time.sleep(1)
        page.screenshot(path="blog_dropdown_hover.png")
        
        browser.close()

if __name__ == "__main__":
    main()
