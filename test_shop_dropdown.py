from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 800})
        page.goto("http://localhost:3001/shop.html")
        page.wait_for_selector(".mockup-header")
        
        # Hover over the mega menu link
        menu_link = page.locator(".has-mega-menu").first
        menu_link.hover()
        page.wait_for_timeout(1000) # wait for animation
        
        # Take a screenshot of the dropdown open
        page.screenshot(path="shop_dropdown_reset.png")
        
        browser.close()

if __name__ == "__main__":
    main()
