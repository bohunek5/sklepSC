import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto("http://localhost:9999/shop.html", wait_until="networkidle")
        
        cards = await page.evaluate('''() => {
            const els = Array.from(document.querySelectorAll('.mockup-product-card[data-id="99999"]'));
            return els.map(el => {
                const img = el.querySelector('img.mockup-product-img');
                const icons = el.querySelectorAll('.action-btn-circle');
                return {
                    img_src: img ? img.src : null,
                    icons_count: icons.length
                };
            });
        }''')
        
        print("Shop product card 99999:", cards)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
