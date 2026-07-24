import os
import glob

html_files = glob.glob("*.html")
script_to_add = """<script type="module">
  import { initSharedPopups } from './js/shared-popups.js';
  initSharedPopups();
</script>"""

for filepath in html_files:
    if filepath == 'old_index.html': continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "import { initSharedPopups }" not in content:
        content = content.replace("</body>", f"{script_to_add}\n</body>")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added to {filepath}")
