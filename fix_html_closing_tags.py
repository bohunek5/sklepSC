import glob
import re

print("Fixing malformed closing tags </a class=\"active\"> across all HTML files...")

html_files = glob.glob("*.html")
for fpath in html_files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    if "</a class=\"active\">" in content:
        content = content.replace("</a class=\"active\">", "</a>")
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)

print("Malformed closing tags fixed.")
