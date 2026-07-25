import os

agent_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(agent_path, 'r', encoding='utf-8') as f: js = f.read()

if 'warranty: null' not in js:
    js = js.replace("voltage: 'auto'", "voltage: 'auto',\n      warranty: null")

if '7 lat' not in js:
    js = js.replace('if (/kuchni|blat|szafk/i.test(lower))', 'if (/7\\s*lat|delux|7y/i.test(lower)) state.warranty = 7;\n\n    if (/kuchni|blat|szafk/i.test(lower))')

with open(agent_path, 'w', encoding='utf-8') as f: f.write(js)

core_path = 'd:/MY-AI-AGENTS/sklepSC/js/configurator-core.js'
with open(core_path, 'r', encoding='utf-8') as f: js = f.read()

if 'if (state.warranty === 7)' not in js:
    js = js.replace('if (tape.lumens) score += Math.min(tape.lumens / 180, 15);', 'if (tape.lumens) score += Math.min(tape.lumens / 180, 15);\n      if (state.warranty === 7 && (tape.product.title.includes("7Y") || tape.product.title.includes("Delux"))) score += 300;')

with open(core_path, 'w', encoding='utf-8') as f: f.write(js)
print('Added warranty hack to AI agent.')
