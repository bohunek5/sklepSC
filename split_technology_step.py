import re

def process():
    with open('d:/MY-AI-AGENTS/sklepSC/configurator.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update the step list
    # Original list:
    # <li><span>02</span><div><strong>Efekt i technologia</strong><small>W/m, COB lub SMD</small></div></li>
    # <li><span>03</span><div><strong>Barwa</strong><small>biała, CCT, RGB</small></div></li>
    
    # Let's change the step list.
    html = html.replace(
        '<li><span>02</span><div><strong>Efekt i technologia</strong><small>W/m, COB lub SMD</small></div></li>',
        '<li><span>02</span><div><strong>Efekt</strong><small>Moc i jasność</small></div></li>\n            <li><span>03</span><div><strong>Technologia</strong><small>COB lub SMD</small></div></li>'
    )
    
    # We need to shift numbers in the step list
    html = html.replace('<li><span>03</span><div><strong>Barwa', '<li><span>04</span><div><strong>Barwa')
    html = html.replace('<li><span>04</span><div><strong>Wymiary', '<li><span>05</span><div><strong>Wymiary')
    html = html.replace('<li><span>05</span><div><strong>Warunki', '<li><span>06</span><div><strong>Warunki')
    html = html.replace('<li><span>06</span><div><strong>Sterowanie', '<li><span>07</span><div><strong>Sterowanie')

    # Also update the hero text: "w 6 prostych krokach" -> "w 7 prostych krokach"
    html = html.replace('6 prostych krokach', '7 prostych krokach')
    html = html.replace('Sześć decyzji technicznych', 'Siedem decyzji technicznych')

    # 2. Extract technology-showcase
    tech_match = re.search(r'(<div class="technology-showcase">.*?</div>\s*)</fieldset>', html, re.DOTALL)
    if not tech_match:
        print("Could not find technology showcase block.")
        return
    tech_block = tech_match.group(1)

    # 3. Remove technology-showcase from step 1 and change its legend
    html = html.replace(tech_block, '')
    html = html.replace('<legend>Efekt i technologia</legend>', '<legend>Efekt i moc</legend>')

    # 4. Shift subsequent data-steps
    # 5 -> 6
    html = html.replace('data-step="5"', 'data-step="6"')
    # 4 -> 5
    html = html.replace('data-step="4"', 'data-step="5"')
    # 3 -> 4
    html = html.replace('data-step="3"', 'data-step="4"')
    # 2 -> 3
    html = html.replace('data-step="2"', 'data-step="3"')

    # 5. Insert the new step 2
    new_step_2 = f"""
            <fieldset class="config-step" data-step="2" hidden>
              <legend>Technologia taśmy</legend>
              <p class="step-kicker">Krok 03 • technologia</p>
              <h3>Jaką budowę ma mieć taśma?</h3>
              <p class="step-description">COB tworzy jednolitą linię, a SMD jest bardziej uniwersalne i często jaśniejsze.</p>
{tech_block}</fieldset>
"""

    html = html.replace('            <fieldset class="config-step" data-step="3" hidden>', new_step_2 + '            <fieldset class="config-step" data-step="3" hidden>')

    with open('d:/MY-AI-AGENTS/sklepSC/configurator.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    print("Updated configurator.html")

process()
