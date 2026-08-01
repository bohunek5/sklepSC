import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Mobile viewport
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            is_mobile=True,
            has_touch=True
        )
        page = await context.new_page()
        
        # Go to product page
        await page.goto("http://localhost:9999/product.html?id=99999")
        await page.wait_for_timeout(2000)
        
        # Take a screenshot
        await page.screenshot(path="screenshot_mobile.png", full_page=True)
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
