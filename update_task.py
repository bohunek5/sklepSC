import os

file_path = '/Users/karolbohdanowicz/.gemini/antigravity-ide/brain/b5993828-91ac-491c-8920-5c59763d5342/task.md'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('- [ ] Update `js/shared-popups.js`', '- [x] Update `js/shared-popups.js`')
content = content.replace('- [ ] Write a python script', '- [x] Write a python script')
content = content.replace('- [ ] Revert `.mockup-search-container`', '- [x] Revert `.mockup-search-container`')
content = content.replace('- [ ] Set body `padding-top: 0;`', '- [x] Set body `padding-top: 0;`')
content = content.replace('- [ ] Inject full-screen Hero section after header.', '- [x] Convert existing `page-hero` to full-screen Hero section.')
content = content.replace('- [ ] Wrap existing content', '- [x] Use existing structure, just modified arrow.')
content = content.replace('- [ ] Ensure "scroll down" arrow', '- [x] Ensure "scroll down" arrow')
content = content.replace('- [ ] Run python script and verify git diff.', '- [x] Run python script and verify git diff.')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

