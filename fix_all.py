import os
import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract header CSS
# We know it starts with '/* Common Header */'
css_match = re.search(r'(/\* Common Header \*/.*?)(\n\s*/\*.*|\n\s*</style>)', index_content, re.DOTALL)
if not css_match:
    print("Could not find CSS in index.html")
    # Let's try another way
    css_match = re.search(r'(\.mockup-header\s*\{.*?\n    \})', index_content, re.DOTALL)
    
# Let's write a better way to extract CSS: from /* Common Header */ up to the end of header styles.
# Looking at index.html, the header CSS ends around line 240, before something else.
