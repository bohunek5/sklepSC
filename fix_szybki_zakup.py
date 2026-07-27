import re

def fix_szybki_zakup():
    with open('js/configurator.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to change the Szybki zakup button so it actually triggers the configurator logic instead of immediately redirecting.
    old_str = 'onclick="event.stopPropagation(); window.location.href=\'checkout.html\'"'
    new_str = 'data-action="quick-buy-tape" onclick="event.stopPropagation();"'
    
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open('js/configurator.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed configurator.js")
    else:
        print("Not found in configurator.js")

    with open('js/ai-agent.js', 'r', encoding='utf-8') as f:
        content2 = f.read()

    # In ai-agent.js, the Szybki zakup button immediately redirects to checkout.html.
    # We should add the items to the cart first.
    old_ai_click = '''ctaBuy.onclick = (e) => {
          e.preventDefault();
          window.location.href = 'checkout.html';
        };'''
    new_ai_click = '''ctaBuy.onclick = (e) => {
          e.preventDefault();
          addItemsToCart(aiSessionState.lastProposedItems);
          window.location.href = 'checkout.html';
        };'''
    
    if old_ai_click in content2:
        content2 = content2.replace(old_ai_click, new_ai_click)
        with open('js/ai-agent.js', 'w', encoding='utf-8') as f:
            f.write(content2)
        print("Fixed ai-agent.js")
    else:
        print("Not found in ai-agent.js")

if __name__ == "__main__":
    fix_szybki_zakup()
