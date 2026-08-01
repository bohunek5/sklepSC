import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto("http://localhost:9999/index.html", wait_until="networkidle")
        
        # Check if the product 99999 is present in the DOM
        cards = await page.evaluate('''() => {
            const el = document.querySelector('.product-card[data-id="99999"]');
            if (!el) return null;
            const img = el.querySelector('img');
            const icons = el.querySelectorAll('.action-btn-circle');
            return {
                img_src: img ? img.src : null,
                img_visible: img ? (img.offsetWidth > 0 && img.offsetHeight > 0) : false,
                icons_count: icons.length
            };
        }''')
        
        print("Product card 99999:", cards)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
