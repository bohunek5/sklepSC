import sys

def fix_emojis():
    with open('shop.html', 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('?? Dla Domu', '🏠 Dla Domu')
    content = content.replace('?? Tryb PRO', '🛠️ Tryb PRO')
    content = content.replace('?? Filtruj i Sortuj', '⚙️ Filtruj i Sortuj')

    with open('shop.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Emojis fixed")

if __name__ == '__main__':
    fix_emojis()
