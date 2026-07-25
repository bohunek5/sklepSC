let currentLang = localStorage.getItem('prescot_lang') || 'pl';
let translations = {};

// We define a fallback function for product translation if 'en' fields are missing
function translateText(text) {
  if (currentLang === 'pl') return text;
  
  // Clean whitespace for matching
  const cleanText = text.trim();
  if (translations[cleanText]) {
    return text.replace(cleanText, translations[cleanText]);
  }
  
  // If no direct match, return original (or we could try heuristic product translations)
  return text;
}

// Function to translate all elements with data-i18n attribute or just text nodes
function translatePage() {
  document.querySelectorAll('.lang-flag').forEach(flag => {
    if (flag.getAttribute('data-lang') === currentLang) {
      flag.classList.add('active');
    } else {
      flag.classList.remove('active');
    }
  });

  if (currentLang === 'pl') {
    // If PL is chosen, we would ideally need a reverse dictionary or reload the page
    // For a robust SPA approach without framework, a page reload is safest to reset all dynamic JS states
    return;
  }

  // Very naive global replace for specific text nodes to avoid breaking HTML
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const nodesToReplace = [];
  let node;
  
  while (node = walker.nextNode()) {
    if (node.parentElement && node.parentElement.tagName !== 'SCRIPT' && node.parentElement.tagName !== 'STYLE') {
      const text = node.nodeValue;
      if (text.trim().length > 0) {
         let translated = text;
         Object.keys(translations).forEach(plKey => {
            // Use regex for exact word boundaries if needed, or exact match
            if (translated.includes(plKey)) {
               translated = translated.replace(new RegExp(`\\\\b${plKey}\\\\b`, 'g'), translations[plKey]);
            }
         });
         
         // Direct exact match
         if (translations[text.trim()]) {
             translated = text.replace(text.trim(), translations[text.trim()]);
         }
         
         if (translated !== text) {
             nodesToReplace.push({ node, translated });
         }
      }
    }
  }
  
  nodesToReplace.forEach(item => {
    item.node.nodeValue = item.translated;
  });
  
  // Also translate inputs
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      const ph = el.getAttribute('placeholder');
      if (translations[ph]) el.setAttribute('placeholder', translations[ph]);
  });
}

function setLanguage(lang) {
  if (currentLang === lang) return;
  localStorage.setItem('prescot_lang', lang);
  currentLang = lang;
  // Reload the page is the most robust way to ensure all JS variables (like products) are re-rendered correctly
  // Alternatively, we can just call translatePage(), but a reload ensures ai-agent and configurator completely re-init
  location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('js/translations.json')
    .then(res => res.json())
    .then(data => {
      translations = data;
      if (currentLang !== 'pl') {
        translatePage();
      }
      
      // Bind language switchers
      document.querySelectorAll('.lang-flag').forEach(flag => {
        flag.addEventListener('click', (e) => {
          e.preventDefault();
          setLanguage(flag.getAttribute('data-lang'));
        });
      });
    })
    .catch(err => console.error("Could not load translations", err));
});

// For dynamically added content by AI or cart
const observer = new MutationObserver((mutations) => {
    if (currentLang === 'en' && Object.keys(translations).length > 0) {
        // Debounce or carefully translate newly added nodes
        // To avoid infinite loops, we disconnect, translate, and reconnect
        observer.disconnect();
        translatePage(); // naive approach, can be optimized
        observer.observe(document.body, { childList: true, subtree: true });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
});
