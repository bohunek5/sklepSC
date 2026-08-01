from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(str(err)))
        
        page.goto("http://localhost:9999/product.html?id=99999")
        page.wait_for_load_state("networkidle")
        
        if errors:
            print("Console errors found:")
            for e in errors:
                print(f" - {e}")
        else:
            print("No console errors found. Page loaded successfully.")
            
        # Check if 360 button exists
        trigger = page.locator("#trigger360")
        if trigger.count() > 0 and trigger.is_visible():
            print("360 button is visible!")
        else:
            print("360 button is NOT visible.")
            
        browser.close()

if __name__ == "__main__":
    run()
