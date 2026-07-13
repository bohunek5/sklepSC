from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 800})
        page.goto("http://localhost:3001/shop.html")
        page.wait_for_timeout(2000)
        
        # screenshot of full page
        page.screenshot(path="shop_full.png", full_page=True)
        print("Took full screenshot")
        
        browser.close()

if __name__ == "__main__":
    main()
