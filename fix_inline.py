import re

def fix_inline():
    with open('js/configurator.js', 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('style="width: 100%; border: none; padding: 0;"', 'style="width: 100%;"')
    
    with open('js/configurator.js', 'w', encoding='utf-8') as f:
        f.write(content)

    with open('js/ai-agent.js', 'r', encoding='utf-8') as f:
        content2 = f.read()

    # In case the previous run command worked or didn't work for ai-agent.js
    content2 = content2.replace("ctaAdd.style.border = 'none';\n        ctaAdd.style.padding = '0';", "")
    content2 = content2.replace("ctaBuy.style.border = 'none';\n        ctaBuy.style.padding = '0';", "")
    
    with open('js/ai-agent.js', 'w', encoding='utf-8') as f:
        f.write(content2)

if __name__ == "__main__":
    fix_inline()
