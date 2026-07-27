import re

def fix_html():
    with open('configurator.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # The issue: the old script appended <!-- Mobile Bottom Navigation --> to the end
    # but there was already an old <nav class="config-bottom-nav"> there!
    # Let's just remove the first one if there are two.
    
    # Let's find all occurrences of <nav class="config-bottom-nav"
    matches = list(re.finditer(r'<nav class="config-bottom-nav".*?</nav>', content, re.DOTALL))
    
    if len(matches) > 1:
        # Keep the last one, remove others
        new_content = content[:matches[0].start()] + content[matches[0].end():]
        with open('configurator.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Removed duplicate nav")
    else:
        print("No duplicates found")

if __name__ == "__main__":
    fix_html()
