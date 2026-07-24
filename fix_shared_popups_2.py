import os
import re

file_path = '/Users/karolbohdanowicz/my-ai-agents/scratch/cooken-offline/js/shared-popups.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace .glass-cat-card CSS block
content = re.sub(
    r'\.glass-cat-card\s*\{[^}]+\}',
    """.glass-cat-card {
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 12px;
            padding: 15px 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            text-align: left;
            gap: 15px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          }
          
          .glass-cat-text-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }""",
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated .glass-cat-card successfully.")
