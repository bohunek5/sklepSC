import os

file_path = '/Users/karolbohdanowicz/my-ai-agents/scratch/cooken-offline/js/shared-popups.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Change grid template to 1fr
content = content.replace('grid-template-columns: repeat(2, 1fr);', 'grid-template-columns: 1fr;')

# Update glass-cat-card styles to be longitudinal
old_card_style = """          .glass-cat-card {
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 16px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
          }"""

new_card_style = """          .glass-cat-card {
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            padding: 15px 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            text-align: left;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
            gap: 15px;
          }
          
          .glass-cat-text-container {
            display: flex;
            flex-direction: column;
          }
          """

if old_card_style in content:
    content = content.replace(old_card_style, new_card_style)
else:
    print("WARNING: Could not find old card style!")

# We also need to wrap the badge and title in .glass-cat-text-container to make flex-row work correctly.
# And we need to adjust icon margin.
old_icon_style = """          .glass-cat-icon {
            font-size: 32px;
            margin-bottom: 12px;
            color: var(--accent-color, #ff6b00);
            filter: drop-shadow(0 0 10px rgba(255, 107, 0, 0.2));
          }"""

new_icon_style = """          .glass-cat-icon {
            font-size: 28px;
            margin-bottom: 0;
            color: var(--accent-color, #ff6b00);
            filter: drop-shadow(0 0 10px rgba(255, 107, 0, 0.2));
            flex-shrink: 0;
          }"""
          
content = content.replace(old_icon_style, new_icon_style)

# Function to wrap badge and title
import re
# Find something like:
# <i class="ph ph-lightbulb glass-cat-icon"></i>
# <span class="glass-cat-badge">Wszystkie</span>
# <h4 class="glass-cat-title">Taśmy LED</h4>

pattern = re.compile(r'(<i class="[^"]+ glass-cat-icon"></i>)\s*(<span class="glass-cat-badge">[^<]+</span>)\s*(<h4 class="glass-cat-title">[^<]+</h4>)')
replacement = r'\1\n          <div class="glass-cat-text-container">\n            \2\n            \3\n          </div>'
content = pattern.sub(replacement, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated js/shared-popups.js to use longitudinal category boxes.")
