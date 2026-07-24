from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 800})
        page.goto("http://localhost:3001/shop.html")
        page.wait_for_timeout(1000)
        
        # screenshot of header
        page.screenshot(path="shop_header.png", clip={"x": 0, "y": 0, "width": 1200, "height": 200})
        print("Took screenshot")
        
        browser.close()

if __name__ == "__main__":
    main()
