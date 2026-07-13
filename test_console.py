from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # Capture console logs
        page.on("console", lambda msg: print(f"Console: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"Page Error: {exc}"))
        
        page.goto("http://localhost:3001/shop.html")
        page.wait_for_timeout(1000)
        
        browser.close()

if __name__ == "__main__":
    main()
