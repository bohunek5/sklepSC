import glob

def fix_logos():
    html_files = glob.glob('*.html')
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        
        # We need to remove the bad styling block injected in earlier conversations
        # Look for this specific buggy block and replace it
        if "max-width: none !important;" in content:
            # Replace the bad height: auto and max-width: none
            content = content.replace("height: auto !important; max-width: 140px !important;", "height: 36px !important; max-width: 170px !important;")
            content = content.replace("max-width: none !important;", "")
            modified = True
            
        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Fixed logo in {f}")

if __name__ == '__main__':
    fix_logos()
