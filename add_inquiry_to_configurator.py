import re
import glob

print("Adding 'Zapytaj o taki produkt' functionality and updating notice texts in configurator...")

# 1. Update js/shared-popups.js to provide global openInquiryModal function
with open("js/shared-popups.js", "r", encoding="utf-8") as f:
    shared_js = f.read()

inquiry_modal_js = """
// --- GLOBAL PRODUCT INQUIRY MODAL (Zapytaj o produkt) ---
function openInquiryModal(presetText = '') {
  let modal = document.getElementById('popupZapytaj');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'product-popup-overlay';
    modal.id = 'popupZapytaj';
    modal.style.cssText = 'display:none; z-index: 99999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 26, 48, 0.7); backdrop-filter: blur(8px); justify-content: center; align-items: center;';
    modal.innerHTML = `
      <div class="product-popup-box" style="max-width: 520px; width: 90%; background: #ffffff; border-radius: 24px; padding: 32px; position: relative; box-shadow: 0 25px 60px rgba(0,0,0,0.25);">
        <button class="popup-close" onclick="document.getElementById('popupZapytaj').style.display='none'" style="position: absolute; top: 20px; right: 20px; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; color: #0b1a30; font-weight: 700;">✕</button>
        <div style="font-size: 11px; font-weight: 800; color: #ff5a00; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Wycena Indywidualna</div>
        <h3 style="margin-bottom: 8px; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 22px; color: #0b1a30;">Zapytaj o produkt / ofertę</h3>
        <p style="font-size: 13.5px; color: #64748b; margin-bottom: 20px; line-height: 1.4;">Nasi specjaliści przygotują wycenę indywidualną taśmy LED i dedykowanego zasilacza.</p>
        <form id="askQuestionForm" onsubmit="event.preventDefault(); alert('Dziękujemy! Twoje zapytanie zostało wysłane. Odpowiemy w ciągu 24 godzin.'); document.getElementById('popupZapytaj').style.display='none';">
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 5px; color: #0b1a30;">Twoje Imię i Nazwisko</label>
            <input type="text" required style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13.5px; font-family: inherit; outline: none;" placeholder="np. Jan Kowalski">
          </div>
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 5px; color: #0b1a30;">Twój Adres E-mail</label>
            <input type="email" required style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13.5px; font-family: inherit; outline: none;" placeholder="np. jan@example.com">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 5px; color: #0b1a30;">Preferencje i treść zapytania</label>
            <textarea id="askQuestionTextarea" required style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; height: 130px; font-family: inherit; resize: vertical; outline: none; line-height: 1.4;" placeholder="Opisz swoje wymagania..."></textarea>
          </div>
          <button type="submit" style="background: linear-gradient(135deg, #0b1a30 0%, #162a45 100%) !important; color: #ffffff !important; width: 100%; border: none !important; cursor: pointer; height: 48px; border-radius: 99px; font-weight: 800; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; box-shadow: 0 6px 20px rgba(11,26,48,0.25);">Wyślij Zapytanie</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }
  const textarea = modal.querySelector('#askQuestionTextarea');
  if (textarea && presetText) {
    textarea.value = presetText;
  }
  modal.style.display = 'flex';
}
window.openInquiryModal = openInquiryModal;
"""

if "window.openInquiryModal" not in shared_js:
    shared_js += "\n" + inquiry_modal_js
    with open("js/shared-popups.js", "w", encoding="utf-8") as f:
        f.write(shared_js)
    print("Injected global openInquiryModal into js/shared-popups.js.")

# 2. Update js/configurator.js to add triggerConfiguratorInquiry and update refreshOptionAvailability
with open("js/configurator.js", "r", encoding="utf-8") as f:
    config_js = f.read()

config_inquiry_helper = """
window.triggerConfiguratorInquiry = function(paramName, paramVal) {
  const locNames = { kitchen: 'Kuchnia & Blat', living: 'Salon, sufit i wnęka', stairs: 'Schody i komunikacja', bathroom: 'Łazienka i strefa wilgotna', outdoor: 'Elewacja, taras i ogród', commercial: 'Ekspozycja i długie ciągi' };
  const lightNames = { '3000K': 'Ciepła 3000K (COB)', '4000K': 'Neutralna 4000K', '6500K': 'Zimna 6500K', 'RGB': 'RGB Multikolor', warm: 'Ciepła 3000K', neutral: 'Neutralna 4000K', cold: 'Zimna 6500K', cct: 'CCT Dual White', rgbw: 'RGBW Multikolor' };
  const controlNames = { 'touch-remote': 'Pilot dotykowy RF Prescot', 'wall-panel': 'Panel ścienny Prescot', 'smart-wifi': 'Smart WiFi (Tuya/App)', switch: 'Przełącznik ON/OFF', dimmer: 'Ściemniacz', smart: 'Smart WiFi' };
  const envNames = { dry: 'IP20 (sucho)', damp: 'IP63+ (wilgoć)', outdoor: 'IP65/IP67 (zewnętrzne)' };

  let loc = (typeof state !== 'undefined' && (state.location || state.application)) ? (locNames[state.location || state.application] || state.location || state.application) : 'Standardowe';
  let len = (typeof state !== 'undefined' && (state.lengthMeters || state.length)) ? (state.lengthMeters || state.length) + ' m' : '5 m';
  let light = (typeof state !== 'undefined' && (state.colorTemp || state.light)) ? (lightNames[state.colorTemp || state.light] || state.colorTemp || state.light) : 'Biała';
  let ctrl = (typeof state !== 'undefined' && (state.controlType || state.control)) ? (controlNames[state.controlType || state.control] || state.controlType || state.control) : 'Pilot RF';
  let env = (typeof state !== 'undefined' && (state.ipRating || state.environment)) ? (envNames[state.ipRating || state.environment] || state.ipRating || state.environment) : 'IP20';

  let presetMessage = `Dzień dobry,\\n\\nProszę o przygotowanie wyceny indywidualnej dla taśmy LED i zasilacza o preferowanych parametrach:\\n` +
    `• Przeznaczenie / miejsce: ${loc}\\n` +
    `• Szacowana długość: ${len}\\n` +
    `• Barwa światła / technologia: ${light}\\n` +
    `• Klasa szczelności: ${env}\\n` +
    `• Sposób sterowania: ${ctrl}\\n` +
    (paramName ? `• Wybrany parametr: ${paramName} (${paramVal})\\n` : '') +
    `\\nProszę o kontakt w sprawie doradztwa i dopasowania wariantu z oferty Prescot.`;

  if (typeof window.openInquiryModal === 'function') {
    window.openInquiryModal(presetMessage);
  } else {
    alert("Dziękujemy za zainteresowanie. Otwórz formularz zapytania lub skontaktuj się z nami.");
  }
};
"""

if "window.triggerConfiguratorInquiry" not in config_js:
    config_js = config_inquiry_helper + "\n" + config_js

# Replace refreshOptionAvailability to inject "Zapytaj o taki produkt" button when count === 0
new_refresh_availability = """  function refreshOptionAvailability() {
    form.querySelectorAll('input[type="radio"]').forEach((input) => {
      const label = input.closest('label, .wizard-card-option, .option-select-card, .choice-card');
      if (!label) return;
      let availability = label.querySelector('.option-availability');
      if (!availability) {
        availability = document.createElement('span');
        availability.className = 'option-availability';
        label.appendChild(availability);
      }
      const count = optionCount(input);
      input.disabled = count === 0;
      label.classList.toggle('is-unavailable', count === 0);
      if (count > 0) {
        availability.innerHTML = `${count} zgodnych`;
      } else {
        availability.innerHTML = `<button type="button" class="btn-inquiry-unavailable" onclick="event.preventDefault(); event.stopPropagation(); triggerConfiguratorInquiry('${input.name}', '${input.value}');">✉ Zapytaj o taki produkt</button>`;
      }
    });
  }"""

config_js = re.sub(r'function refreshOptionAvailability\(\)\s*\{.*?\}\s*(?=function|\n[a-z])', new_refresh_availability + "\n\n", config_js, flags=re.DOTALL)

with open("js/configurator.js", "w", encoding="utf-8") as f:
    f.write(config_js)

print("Updated js/configurator.js with triggerConfiguratorInquiry and btn-inquiry-unavailable button.")

# 3. Update configurator.html notice text & CSS
with open("configurator.html", "r", encoding="utf-8") as f:
    config_html = f.read()

# Replace sidebar note texts
config_html = config_html.replace(
    "Jeśli danych będzie za mało, zatrzymamy dobór i skierujemy projekt do doradcy.",
    "Jeśli szukasz niestandardowego rozwiązania, nasi specjaliści przygotują wycenę indywidualną dobranej taśmy LED i zasilacza."
)
config_html = config_html.replace(
    "Brak danych oznaczamy do potwierdzenia z doradcą.",
    "Nasi specjaliści przygotują ofertę szytą na miarę."
)
config_html = config_html.replace(
    "Bez zgadywania",
    "Wycena Indywidualna"
)

# Add CSS for .btn-inquiry-unavailable
btn_css = """<style id="configurator-inquiry-unavailable-style">
  .btn-inquiry-unavailable {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
    margin-top: 8px !important;
    padding: 6px 14px !important;
    background: #0b1a30 !important;
    color: #ffffff !important;
    font-size: 11px !important;
    font-weight: 800 !important;
    border: none !important;
    border-radius: 99px !important;
    cursor: pointer !important;
    box-shadow: 0 4px 12px rgba(11, 26, 48, 0.2) !important;
    transition: all 0.25s ease !important;
    text-transform: uppercase !important;
    letter-spacing: 0.3px !important;
    position: relative !important;
    z-index: 20 !important;
  }

  .btn-inquiry-unavailable:hover {
    background: #ff5a00 !important;
    transform: translateY(-1px) scale(1.04) !important;
    box-shadow: 0 6px 18px rgba(255, 90, 0, 0.4) !important;
  }

  .is-unavailable {
    opacity: 0.88 !important;
    border-color: #e2e8f0 !important;
  }
</style>
"""

if "id=\"configurator-inquiry-unavailable-style\"" not in config_html and "</head>" in config_html:
    config_html = config_html.replace("</head>", f"{btn_css}\n</head>")

with open("configurator.html", "w", encoding="utf-8") as f:
    f.write(config_html)

print("Updated notice text and injected inquiry button styles into configurator.html.")
