import re

with open("old_index.html", "r", encoding="utf-8") as f:
    old_content = f.read()

match = re.search(r"<!-- Latest Blog Articles Section -->.*?</section>", old_content, re.DOTALL)
if match:
    blog_section = match.group(0)
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()
    
    if "Najnowsze Wpisy na Blogu" not in content:
        # insert before <footer class="mockup-footer">
        content = content.replace('<footer class="mockup-footer">', blog_section + '\n\n  <footer class="mockup-footer">')
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("Blog section restored to index.html successfully.")
    else:
        print("Blog section already in index.html.")
else:
    print("Could not find blog section in old index.html")
