import re
import os

file_path = 'd:/MY-AI-AGENTS/sklepSC/js/configurator.js'
with open(file_path, 'r', encoding='utf-8') as f:
    js = f.read()

# We need to replace the local implementations with calls to ConfiguratorCore
replacements = [
    (r'const normalize = \(value\) => [\s\S]*?\.toLowerCase\(\);', 'const normalize = ConfiguratorCore.normalize;'),
    (r'const productText = \(product\) => [\s\S]*?\]\.join\(\' \'\)\);', 'const productText = ConfiguratorCore.productText;'),
    (r'const stockNumber = \(product\) =>.*?\|\| 0;', 'const stockNumber = ConfiguratorCore.stockNumber;'),
    (r'const firstNumber = \(text, expression\) => \{[\s\S]*?return match \? Number\.parseFloat.*? : null;\s*\};', 'const firstNumber = ConfiguratorCore.firstNumber;'),
    (r'const productVoltage = \(product\) =>.*?;', 'const productVoltage = ConfiguratorCore.productVoltage;'),
    (r'const productPower = \(product\) =>.*?;', 'const productPower = ConfiguratorCore.productPower;'),
    (r'const productLumens = \(product\) =>.*?;', 'const productLumens = ConfiguratorCore.productLumens;'),
    (r'const productIp = \(product\) =>.*?;', 'const productIp = ConfiguratorCore.productIp;'),
    (r'const productCri = \(product\) =>.*?;', 'const productCri = ConfiguratorCore.productCri;'),
    (r'const productWidth = \(product\) =>.*?;', 'const productWidth = ConfiguratorCore.productWidth;'),
    (r'const productTechnology = \(product\) =>.*?;', 'const productTechnology = ConfiguratorCore.productTechnology;'),
    (r'function productLight\(product\) \{[\s\S]*?return null;\s*\}', 'const productLight = ConfiguratorCore.productLight;'),
    (r'function normalizeTape\(product\) \{[\s\S]*?return \{[\s\S]*?\};\s*\}', 'const normalizeTape = ConfiguratorCore.normalizeTape;'),
    (r'function isTape\(product\) \{[\s\S]*?\}', 'const isTape = ConfiguratorCore.isTape;'),
    (r'function hasRequiredTapeData\(tape\) \{[\s\S]*?\}', 'const hasRequiredTapeData = ConfiguratorCore.hasRequiredTapeData;'),
    (r'function applicationMatches\(tape, application\) \{[\s\S]*?\}', 'const applicationMatches = ConfiguratorCore.applicationMatches;'),
    (r'function intensityMatches\(power, intensity\) \{[\s\S]*?\}', 'const intensityMatches = ConfiguratorCore.intensityMatches;'),
    (r'function environmentMatches\(tape, environment, application\) \{[\s\S]*?\}', 'const environmentMatches = ConfiguratorCore.environmentMatches;'),
    (r'function controlMatches\(configuration\) \{[\s\S]*?\}', 'const controlMatches = ConfiguratorCore.controlMatches;'),
    (r'function tapeMatches\(tape, configuration\) \{[\s\S]*?\}', 'const tapeMatches = ConfiguratorCore.tapeMatches;'),
    
    (r'const filteredTapes = \(configuration = state\) => tapes\.filter\(\(tape\) => tapeMatches\(tape, configuration\)\);', 'const filteredTapes = (configuration = state) => ConfiguratorCore.filteredTapes(tapes, configuration);'),
    
    (r'function scoreTape\(tape\) \{[\s\S]*?return score;\s*\}', 'const scoreTape = (tape) => ConfiguratorCore.scoreTape(tape, state);'),
    
    (r'function chooseCandidates\(\) \{[\s\S]*?\.slice\(0, 3\);\s*\}', 'const chooseCandidates = () => ConfiguratorCore.chooseCandidates(tapes, state);'),
    
    (r'function categoryProducts\(fragment\) \{[\s\S]*?\}', 'const categoryProducts = (fragment) => ConfiguratorCore.categoryProducts(catalog, fragment);'),
    
    (r'function powerSupplyPlan\(tape\) \{[\s\S]*?return \{.*?reason: null \};\s*\}', 'const powerSupplyPlan = (tape) => ConfiguratorCore.powerSupplyPlan(tape, state, catalog);'),
    
    (r'function controllerChannels\(light\) \{[\s\S]*?\}', 'const controllerChannels = ConfiguratorCore.controllerChannels;'),
    
    (r'function controllerPlan\(tape, psuPlan\) \{[\s\S]*?return \{.*?maxCurrent: selected\.amperes \};\s*\}', 'const controllerPlan = (tape, psuPlan) => ConfiguratorCore.controllerPlan(tape, psuPlan, state, catalog);'),
    
    (r'function parseRollLength\(product\) \{[\s\S]*?\}', 'const parseRollLength = ConfiguratorCore.parseRollLength;'),
]

for pattern, replacement in replacements:
    js, count = re.subn(pattern, replacement, js, count=1)
    if count == 0:
        print(f"Failed to replace: {pattern[:50]}...")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Finished updating configurator.js")

# Add configurator-core.js to configurator.html before configurator.js
html_path = 'd:/MY-AI-AGENTS/sklepSC/configurator.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

if 'configurator-core.js' not in html:
    html = html.replace('<script src="js/configurator.js"></script>', '<script src="js/configurator-core.js"></script>\n  <script src="js/configurator.js"></script>')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Injected configurator-core.js into configurator.html")

