import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        page.on("console", lambda msg: print(f"CONSOLE: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"ERROR: {err}"))
        page.on("requestfailed", lambda req: print(f"FAILED: {req.url} - {req.failure}"))
        
        await page.goto("http://localhost:9999/product.html?id=99999", wait_until="networkidle")
        print("Page loaded.")
        
        try:
            await page.click("#trigger360", timeout=3000)
            print("Clicked #trigger360 button")
            await asyncio.sleep(2)
        except Exception as e:
            print("Could not click 360 button:", e)
            
        try:
            await page.click("#actionBar360Btn", timeout=3000)
            print("Clicked #actionBar360Btn button")
            await asyncio.sleep(2)
        except Exception as e:
            print("Could not click actionBar360Btn button:", e)
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
