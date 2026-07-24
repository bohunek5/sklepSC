import re

js_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Update parseIntent to return hasAnyIntent
if 'hasAnyIntent' not in js:
    js = js.replace("return { state, wantsToBuy };", "const hasAnyIntent = Boolean(state.application || state.light || state.intensity || state.technology !== 'auto' || lengthMatch || /12v|24v|48v/i.test(lower));\n    return { state, wantsToBuy, hasAnyIntent };")

# In processUserInput, handle conversational responses
old_block = """    // Check if it's a naked buy command ("dodaj", "kup to") without specifics"""

new_block = """    const { hasAnyIntent: anyIntentOverall } = parseIntent(text);
    const lowerText = text.toLowerCase();
    
    // Check conversational intent if no product intent is found
    if (!anyIntentOverall && !overallBuy) {
        if (/cześć|czesc|witaj|hej|siema|dzień dobry|witam/i.test(lowerText)) {
            streamText(aiBubble, "Cześć! W czym mogę Ci dzisiaj pomóc? Opisz mi, jakie pomieszczenie chcesz oświetlić, jakiej długości taśmy potrzebujesz i jakiego efektu oczekujesz.", () => {
                aiBubble.innerHTML = "Cześć! W czym mogę Ci dzisiaj pomóc? Opisz mi, jakie pomieszczenie chcesz oświetlić, jakiej długości taśmy potrzebujesz i jakiego efektu oczekujesz.";
            });
            return;
        } else if (/dzięki|dzieki|dziekuje|dziękuję/i.test(lowerText)) {
            streamText(aiBubble, "Nie ma za co! Polecam się na przyszłość. Czy mogę jeszcze w czymś pomóc?", () => {
                aiBubble.innerHTML = "Nie ma za co! Polecam się na przyszłość. Czy mogę jeszcze w czymś pomóc?";
            });
            return;
        } else {
            streamText(aiBubble, "Nie do końca zrozumiałem. Podaj mi proszę konkrety: do jakiego pomieszczenia szukasz oświetlenia, jak długiej taśmy potrzebujesz i jakiej barwy światła oczekujesz?", () => {
                aiBubble.innerHTML = "Nie do końca zrozumiałem. Podaj mi proszę konkrety: do jakiego pomieszczenia szukasz oświetlenia, jak długiej taśmy potrzebujesz i jakiej barwy światła oczekujesz?";
            });
            return;
        }
    }

    // Check if it's a naked buy command ("dodaj", "kup to") without specifics"""

if "Check conversational intent if no product intent is found" not in js:
    js = js.replace(old_block, new_block)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print('Added conversational fallback to ai-agent.js')
