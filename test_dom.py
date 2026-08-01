import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        await page.goto("http://localhost:9999/product.html?id=99999", wait_until="networkidle")
        await page.click("#trigger360")
        await asyncio.sleep(1)
        
        display = await page.evaluate("document.getElementById('sixtyContainer').style.display")
        src = await page.evaluate("document.getElementById('sixtyImg').src")
        print("sixtyContainer display:", display)
        print("sixtyImg src:", src)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
