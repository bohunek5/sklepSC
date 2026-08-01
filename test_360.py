import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Go to product page
        await page.goto("http://localhost:9999/product.html?id=PR-MAD-XX-1224")
        
        # Wait for page load
        await page.wait_for_selector("#trigger360", timeout=5000)
        print("trigger360 found.")
        
        # Check if the trigger is visible
        trigger = await page.locator("#trigger360")
        if await trigger.is_visible():
            print("trigger360 is visible. Clicking it...")
            await trigger.click()
            
            # Wait for 360 viewer
            try:
                await page.wait_for_selector("#sixtyImg", timeout=2000)
                img_src = await page.locator("#sixtyImg").get_attribute("src")
                print(f"sixtyImg src: {img_src}")
                
                # Check how many images loaded by evaluating JS
                loaded = await page.evaluate('document.querySelectorAll(".mockup-product-360").length')
                print(f"Mockup 360 images count: {loaded}")
                
            except Exception as e:
                print(f"Error after click: {e}")
        else:
            print("trigger360 is NOT visible!")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
