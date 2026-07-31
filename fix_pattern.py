import os
import glob

files = glob.glob('*.html') + glob.glob('js/*.js') + glob.glob('dist/js/*.js')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'PRESCOT_pattern2.svg' in content:
        new_content = content.replace('PRESCOT_pattern2.svg', 'prescot-pattern.png')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Fixed {f}")
