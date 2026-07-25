import codecs
import os
import glob

workspace = r'd:\MY-AI-AGENTS\sklepSC'

files_to_fix = []
for ext in ['*.html', '*.css']:
    files_to_fix.extend(glob.glob(os.path.join(workspace, '**', ext), recursive=True))

replaced_count = 0

for file_path in files_to_fix:
    if 'node_modules' in file_path or 'dist' in file_path:
        continue
    try:
        with codecs.open(file_path, 'r', 'utf-8', errors='ignore') as f:
            content = f.read()
        
        new_content = content
        new_content = new_content.replace('#ff5e00', '#ff5a00')
        new_content = new_content.replace('#FF5E00', '#ff5a00')
        new_content = new_content.replace('#e14f27', '#ff5a00')
        new_content = new_content.replace('#E14F27', '#ff5a00')
        new_content = new_content.replace('rgba(225, 79, 39,', 'rgba(255, 90, 0,')
        new_content = new_content.replace('rgba(255, 94, 0,', 'rgba(255, 90, 0,')
        
        if new_content != content:
            with codecs.open(file_path, 'w', 'utf-8') as f:
                f.write(new_content)
            replaced_count += 1
            print(f"Fixed brand orange in: {os.path.relpath(file_path, workspace)}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print(f"Total files updated with official brand orange (#ff5a00): {replaced_count}")
