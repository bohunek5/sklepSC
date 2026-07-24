import os
import re

base_dir = '/Users/karolbohdanowicz/my-ai-agents/scratch/cooken-offline'

clean_css = """
/* Clean Search Bar Styling */
.mockup-search-container {
  display: flex !important;
  align-items: center !important;
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  border-radius: 99px !important;
  padding: 6px 16px !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.mockup-search-container:focus-within {
  background: rgba(255, 255, 255, 0.22) !important;
  border-color: rgba(255, 255, 255, 0.55) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
}

.mockup-search-container input {
  border: none !important;
  background: transparent !important;
  background-color: transparent !important;
  outline: none !important;
  font-size: 13px !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  font-weight: 500 !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  box-shadow: none !important;
  letter-spacing: 0.3px !important;
}

.mockup-search-container input::placeholder {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  color: rgba(255, 255, 255, 0.75) !important;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.75) !important;
  opacity: 1 !important;
  font-weight: 400 !important;
}

.mockup-search-container button {
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.mockup-search-container button svg {
  stroke: #ffffff !important;
  transition: stroke 0.3s ease !important;
}

/* Scrolled Header Search Bar State */
.mockup-header.scrolled .mockup-search-container {
  background: rgba(11, 26, 48, 0.05) !important;
  border-color: rgba(11, 26, 48, 0.15) !important;
}

.mockup-header.scrolled .mockup-search-container:focus-within {
  background: rgba(11, 26, 48, 0.08) !important;
  border-color: rgba(11, 26, 48, 0.3) !important;
}

.mockup-header.scrolled .mockup-search-container input {
  color: #0b1a30 !important;
  -webkit-text-fill-color: #0b1a30 !important;
}

.mockup-header.scrolled .mockup-search-container input::placeholder {
  color: rgba(11, 26, 48, 0.6) !important;
  -webkit-text-fill-color: rgba(11, 26, 48, 0.6) !important;
}

.mockup-header.scrolled .mockup-search-container button svg {
  stroke: #0b1a30 !important;
}

/* Autofill Overrides */
.mockup-search-container input:-webkit-autofill,
.mockup-search-container input:-webkit-autofill:hover, 
.mockup-search-container input:-webkit-autofill:focus, 
.mockup-search-container input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 50000s ease-in-out 0s !important;
}

.mockup-header.scrolled .mockup-search-container input:-webkit-autofill,
.mockup-header.scrolled .mockup-search-container input:-webkit-autofill:hover, 
.mockup-header.scrolled .mockup-search-container input:-webkit-autofill:focus, 
.mockup-header.scrolled .mockup-search-container input:-webkit-autofill:active {
  -webkit-text-fill-color: #0b1a30 !important;
}
"""

html_files = [f for f in os.listdir(base_dir) if f.endswith('.html') and not f.startswith('old_') and not '_' in f]

for fname in html_files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove monospace Courier New overrides
    content = content.replace("font-family: 'Courier New', Courier, monospace;", "font-family: 'Inter', sans-serif;")
    content = content.replace("-webkit-box-shadow: 0 0 0 1000px #f3f3f3 inset !important;", "-webkit-box-shadow: 0 0 0 1000px transparent inset !important;")
    
    # Inject clean_css right before </head>
    if '</head>' in content:
        style_block = f"<style>{clean_css}</style>\n</head>"
        content = content.replace('</head>', style_block, 1)
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated search styles in {fname}")

# Update header_style.css
css_path = os.path.join(base_dir, 'header_style.css')
if os.path.exists(css_path):
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write("\n" + clean_css + "\n")
    print("Updated header_style.css")
