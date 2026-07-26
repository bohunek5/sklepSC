import glob, codecs

css_link = '  <link rel="stylesheet" href="css/custom-buttons.css">\n</head>'

for file in glob.glob('d:/MY-AI-AGENTS/sklepSC/*.html'):
    if 'original_index' in file: continue
    
    with codecs.open(file, 'r', 'utf-8') as f:
        content = f.read()
    
    if 'css/custom-buttons.css' not in content:
        new_content = content.replace('</head>', css_link)
        if new_content != content:
            with codecs.open(file, 'w', 'utf-8') as f:
                f.write(new_content)
            print('Updated', file)
