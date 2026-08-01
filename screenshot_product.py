import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        # Go to product page
        await page.goto("http://localhost:9999/product.html?id=99999")
        
        # Wait a bit for JS to load
        await page.wait_for_timeout(2000)
        
        # Take a screenshot
        await page.screenshot(path="screenshot_product.png")
        
        # Try clicking the 360 trigger
        trigger = await page.locator("#trigger360")
        if await trigger.is_visible():
            await trigger.click()
            await page.wait_for_timeout(2000)
            await page.screenshot(path="screenshot_product_360.png")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
