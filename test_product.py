import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto("http://localhost:9999/product.html?id=99999", wait_until="networkidle")
        
        # Check if product was found
        product_title = await page.evaluate("document.querySelector('h1').innerText")
        print("Product title:", product_title)
        
        # Check if sixtyViewerContainer exists and its display property
        display = await page.evaluate("document.getElementById('sixtyViewerContainer').style.display")
        print("sixtyViewerContainer display:", display)
        
        # Click 360 button if exists
        try:
            await page.click("#trigger360", timeout=2000)
            print("Clicked 360 button")
            await asyncio.sleep(1)
            display_after = await page.evaluate("document.getElementById('sixtyViewerContainer').style.display")
            print("sixtyViewerContainer display after click:", display_after)
            sixty_src = await page.evaluate("document.getElementById('sixtyImg').src")
            print("sixtyImg src:", sixty_src)
        except Exception as e:
            print("Could not trigger 360 button:", e)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
