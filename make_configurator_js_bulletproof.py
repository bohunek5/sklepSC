import re

print("Applying bulletproof null checks across js/configurator.js...")

with open("js/configurator.js", "r", encoding="utf-8") as f:
    js_code = f.read()

# 1. Update updateProjectVisual with null checks
old_visual = """  function updateProjectVisual() {
    const data = applicationData[state.application];
    if (!data) return;
    const visual = document.getElementById('projectVisual');
    visual.style.backgroundImage = `linear-gradient(0deg, rgba(6,19,36,.92), rgba(6,19,36,.08)), url("${data.image}")`;
    document.getElementById('projectVisualTitle').textContent = data.title;
    document.getElementById('projectVisualMeta').textContent = data.meta;
  }"""

new_visual = """  function updateProjectVisual() {
    const data = applicationData[state.application];
    if (!data) return;
    const visual = document.getElementById('projectVisual');
    if (visual) visual.style.backgroundImage = `linear-gradient(0deg, rgba(6,19,36,.92), rgba(6,19,36,.08)), url("${data.image}")`;
    const titleEl = document.getElementById('projectVisualTitle');
    if (titleEl) titleEl.textContent = data.title;
    const metaEl = document.getElementById('projectVisualMeta');
    if (metaEl) metaEl.textContent = data.meta;
  }"""

js_code = js_code.replace(old_visual, new_visual)

# 2. Update refreshFunnel with null checks
old_funnel = """  function refreshFunnel() {
    const count = filteredTapes().length;
    funnelCount.textContent = String(count);
    funnelStatus.classList.toggle('is-empty', count === 0);
    funnelMessage.textContent = count ? 'taśm spełnia dotychczasowe warunki' : 'zmień ostatni wybór — ta kombinacja nie występuje w katalogu';
    nextButton.disabled = !currentStepValid();
    validationMessage.textContent = count ? '' : 'Ta kombinacja parametrów nie ma dostępnego produktu.';
  }"""

new_funnel = """  function refreshFunnel() {
    const count = filteredTapes().length;
    if (funnelCount) funnelCount.textContent = String(count);
    if (funnelStatus) funnelStatus.classList.toggle('is-empty', count === 0);
    if (funnelMessage) funnelMessage.textContent = count ? 'taśm spełnia dotychczasowe warunki' : 'zmień ostatni wybór — ta kombinacja nie występuje w katalogu';
    if (nextButton) nextButton.disabled = !currentStepValid();
    if (validationMessage) validationMessage.textContent = count ? '' : 'Ta kombinacja parametrów nie ma dostępnego produktu.';
  }"""

js_code = js_code.replace(old_funnel, new_funnel)

# 3. Update lengthTip & renderStep with null checks
old_tip = """  function updateLengthTip() {
    const tip = document.getElementById('lengthTip');
    if (state.length >= 20) tip.textContent = `${state.length} m to długi ciąg. Porównamy 24 V i 48 V oraz podzielimy obciążenie zasilaczy.`;
    else if (state.length > 10) tip.textContent = `${state.length} m może wymagać zasilania z kilku punktów lub podziału na krótsze sekcje.`;
    else tip.textContent = `Dla ${state.length} m standardowy system 12 V lub 24 V zwykle nie wymaga złożonego podziału.`;
  }"""

new_tip = """  function updateLengthTip() {
    const tip = document.getElementById('lengthTip');
    if (!tip) return;
    if (state.length >= 20) tip.textContent = `${state.length} m to długi ciąg. Porównamy 24 V i 48 V oraz podzielimy obciążenie zasilaczy.`;
    else if (state.length > 10) tip.textContent = `${state.length} m może wymagać zasilania z kilku punktów lub podziału na krótsze sekcje.`;
    else tip.textContent = `Dla ${state.length} m standardowy system 12 V lub 24 V zwykle nie wymaga złożonego podziału.`;
  }"""

js_code = js_code.replace(old_tip, new_tip)

old_step = """  function renderStep() {
    stepElements.forEach((element, index) => { element.hidden = index !== currentStep; });
    stepIndicators.forEach((element, index) => {
      element.classList.toggle('active', index === currentStep);
      element.classList.toggle('complete', index < currentStep);
    });
    document.getElementById('progressText').textContent = `${currentStep + 1} / ${stepElements.length}`;
    refreshOptionAvailability();
    refreshFunnel();
  }"""

new_step = """  function renderStep() {
    stepElements.forEach((element, index) => { if (element) element.hidden = index !== currentStep; });
    stepIndicators.forEach((element, index) => {
      if (element) {
        element.classList.toggle('active', index === currentStep);
        element.classList.toggle('complete', index < currentStep);
      }
    });
    const progText = document.getElementById('progressText');
    if (progText) progText.textContent = `${currentStep + 1} / ${stepElements.length}`;
    refreshOptionAvailability();
    refreshFunnel();
  }"""

js_code = js_code.replace(old_step, new_step)

# 4. Wrap event listeners for inputs and buttons with null checks
old_listeners = """  [lengthInput, segmentsInput].forEach((input) => input.addEventListener('input', () => {
    state.length = Number(lengthInput.value);
    state.segments = Number(segmentsInput.value);
    updateLengthTip();
    refreshFunnel();
  }));

  nextButton.addEventListener('click', () => {
    if (!currentStepValid()) {
      validationMessage.textContent = 'Uzupełnij ten krok, aby przejść dalej.';
      return;
    }
    if (currentStep < stepElements.length - 1) {
      currentStep += 1;
      renderStep();
      document.querySelector('.configurator-shell').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else renderResults();
  });

  previousButton.addEventListener('click', () => {
    if (currentStep === 0) return;
    currentStep -= 1;
    results.hidden = true;
    renderStep();
  });

  document.getElementById('editConfiguration').addEventListener('click', () => {
    results.hidden = true;
    document.getElementById('configurator').scrollIntoView({ behavior: 'smooth' });
  });"""

new_listeners = """  [lengthInput, segmentsInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        if (lengthInput) state.length = Number(lengthInput.value);
        if (segmentsInput) state.segments = Number(segmentsInput.value);
        updateLengthTip();
        refreshFunnel();
      });
    }
  });

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (!currentStepValid()) {
        if (validationMessage) validationMessage.textContent = 'Uzupełnij ten krok, aby przejść dalej.';
        return;
      }
      if (currentStep < stepElements.length - 1) {
        currentStep += 1;
        renderStep();
        const shell = document.querySelector('.configurator-shell') || document.getElementById('configurator');
        if (shell) shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else renderResults();
    });
  }

  if (previousButton) {
    previousButton.addEventListener('click', () => {
      if (currentStep === 0) return;
      currentStep -= 1;
      if (results) results.hidden = true;
      renderStep();
    });
  }

  const editConfigBtn = document.getElementById('editConfiguration');
  if (editConfigBtn) {
    editConfigBtn.addEventListener('click', () => {
      if (results) results.hidden = true;
      const configSec = document.getElementById('configurator');
      if (configSec) configSec.scrollIntoView({ behavior: 'smooth' });
    });
  }"""

js_code = js_code.replace(old_listeners, new_listeners)

with open("js/configurator.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("js/configurator.js updated with complete bulletproof null checks.")
