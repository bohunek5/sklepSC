import re

file_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the chat-history div to contain ONLY the welcome message
new_history = """
        <div class="chat-history">
          <div class="chat-message">
            <div class="avatar avatar-ai">
              <svg class="gemini-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.645 9.355L24 12L14.645 14.645L12 24L9.355 14.645L0 12L9.355 9.355L12 0Z"/></svg>
            </div>
            <div class="message-bubble">
              Cześć! Jestem Twoim wirtualnym doradcą oświetleniowym. Opowiedz mi o swoim projekcie. Co i gdzie chcesz oświetlić? Wpisz np. "Potrzebuję 12m mocnej taśmy COB ciepłej do salonu".
            </div>
          </div>
        </div>
"""

html = re.sub(r'<div class="chat-history">.*?</div>\s*<div class="ai-input-area">', new_history + '\n        <div class="ai-input-area">', html, flags=re.DOTALL)

# Add scripts before closing body
scripts = """
  <script src="js/configurator-core.js"></script>
  <script src="js/ai-agent.js"></script>
"""
html = html.replace('  <script src="js/smart-search.js"></script>', scripts + '  <script src="js/smart-search.js"></script>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated ai-shopping.html")
