from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3001/shop.html")
        
        # Get the computed color of the first category link
        color = page.evaluate('''() => {
            const el = document.querySelector('.magic-dropdown ul li a');
            return window.getComputedStyle(el).color;
        }''')
        
        display = page.evaluate('''() => {
            const el = document.querySelector('.magic-dropdown ul li a');
            return window.getComputedStyle(el).display;
        }''')
        
        visibility = page.evaluate('''() => {
            const el = document.querySelector('.magic-dropdown ul li a');
            return window.getComputedStyle(el).visibility;
        }''')
        
        opacity = page.evaluate('''() => {
            const el = document.querySelector('.magic-dropdown ul li a');
            return window.getComputedStyle(el).opacity;
        }''')
        
        print(f"Color: {color}")
        print(f"Display: {display}")
        print(f"Visibility: {visibility}")
        print(f"Opacity: {opacity}")
        browser.close()

if __name__ == "__main__":
    main()
