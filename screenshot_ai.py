import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        # Go to ai shopping page
        await page.goto("http://localhost:9999/ai-shopping.html")
        await page.wait_for_timeout(2000)
        
        # Take a screenshot
        await page.screenshot(path="screenshot_ai.png")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
