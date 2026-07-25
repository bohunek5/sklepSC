import codecs

with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'r', 'utf-8') as f:
    html = f.read()

replacements = {
    'Ta>my': 'Taśmy',
    'bieli>ci': 'bielistci',
    'g\'ƈwna': 'główna',
    'g\'ƈwną': 'główną',
    'inteligentnych ': 'inteligentnych ',
    'Otwƈrz': 'Otwórz',
    'Swƈj': 'Swój',
    'swƈj': 'swój',
    'wy>lij': 'wyślij',
    'Wy>lij': 'Wyślij',
    'Zasilanie ': 'Zasilanie ',
    'Ta>ma': 'Taśma',
    'ta>ma': 'taśma',
    'ta>mę': 'taśmę',
    'o>wietleniowym': 'oświetleniowym',
    'o>wietli?': 'oświetlić?',
    'Potrzebujt': 'Potrzebuję',
    'ciep\'ej': 'ciepłej',
    'pomys\'': 'pomysł',
    'Ta>my': 'Taśmy',
    '?': 'ś',
    '"': 'ń',
    '~': 'ź',
    't': 'ę',
}

for k, v in replacements.items():
    html = html.replace(k, v)

with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'w', 'utf-8') as f:
    f.write(html)
