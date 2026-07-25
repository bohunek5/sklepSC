
const fs = require("fs");
let html = fs.readFileSync("d:/MY-AI-AGENTS/sklepSC/index.html", "utf8");

// 1. Rewrite .mobile-menu CSS
const oldCssMatch = html.match(/\.mobile-menu \{[\s\S]*?letter-spacing: 2px;\s*\}/);
if (oldCssMatch) {
  html = html.replace(oldCssMatch[0], `    /* Premium Mobile Menu - Glassmorphism */
    .mobile-menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      z-index: 998;
      padding: 120px 8% 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mobile-menu.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    .mobile-menu ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 30px;
      padding: 0;
      margin: 0;
      text-align: center;
      width: 100%;
    }
    .mobile-menu a {
      text-decoration: none;
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      display: inline-block;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mobile-menu.active a {
      transform: translateY(0);
      opacity: 1;
    }
    .mobile-menu.active li:nth-child(1) a { transition-delay: 0.1s; }
    .mobile-menu.active li:nth-child(2) a { transition-delay: 0.15s; }
    .mobile-menu.active li:nth-child(3) a { transition-delay: 0.2s; }
    .mobile-menu.active li:nth-child(4) a { transition-delay: 0.25s; }
    .mobile-menu.active li:nth-child(5) a { transition-delay: 0.3s; }
    .mobile-menu.active li:nth-child(6) a { transition-delay: 0.35s; }
    .mobile-menu.active li:nth-child(7) a { transition-delay: 0.4s; }
    .mobile-menu a:active {
      transform: scale(0.95);
      color: rgba(255,255,255,0.7);
    }`);
}

// 2. Rewrite .mobile-menu HTML
const oldHtmlMatch = html.match(/<nav class="mobile-menu" id="mobileMenu"[\s\S]*?<\/nav>/);
if (oldHtmlMatch) {
  html = html.replace(oldHtmlMatch[0], `<nav class="mobile-menu" id="mobileMenu" aria-label="Nawigacja mobilna" hidden>
      <ul>
        <li><a class="active" href="index.html">Home</a></li>
        <li><a href="shop.html">Sklep</a></li>
        <li><a href="blog.html">Wiedza</a></li>
        <li><a href="about.html">O nas</a></li>
        <li><a href="contact.html">Kontakt</a></li>
        <li><a href="configurator.html">Dobierz system</a></li>
        <li><a href="ai-shopping.html"><img class="gemini-icon" src="images/prescot-pattern.png" style="width: 24px; height: 24px; object-fit: contain; margin-right: 10px; vertical-align: middle; filter: brightness(0) invert(1);">Zakup AI</a></li>
      </ul>
    </nav>`);
}

// 3. Fix slider H1 text size for mobile
const newMobileSliderCss = `
    @media (max-width: 768px) {
      .banner-text h1 {
        font-size: 30px !important;
        line-height: 1.1 !important;
        margin-bottom: 12px !important;
        text-align: center;
      }
      .banner-text p {
        font-size: 15px !important;
        text-align: center;
      }
      .slide-banner-box {
        align-items: center !important;
      }
      .mockup-btn {
        width: 100% !important;
        text-align: center;
        justify-content: center;
      }
      .btn-slide-wrap {
        width: 100%;
        justify-content: center;
      }
      .mockup-btn:active {
        transform: scale(0.96);
      }
`;
html = html.replace(/@media \(max-width: 768px\) \{/, newMobileSliderCss);

// 4. Clean up duplicated mobile-bottom-nav CSS around 1980 and 5160, and improve active state
// Replace first instance with empty, keep and modify second instance.
// Actually, just replace both occurrences of `.mobile-bottom-nav { ... }` with a clean one.
// The easiest is just a targeted replace for the specific rule.
html = html.replace(/\.mobile-bottom-nav \{[\s\S]*?padding-bottom: env\(safe-area-inset-bottom\);\s*\}/g, `.mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border-top: 1px solid rgba(0,0,0,0.05);
      z-index: 9999;
      padding-bottom: env(safe-area-inset-bottom);
    }`);

html = html.replace(/\.mobile-nav-item \{[\s\S]*?transition: var\(--transition\);\s*\}/g, `.mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #999;
      font-size: 10px;
      font-weight: 500;
      gap: 4px;
      width: 20%;
      transition: all 0.3s ease;
    }`);

html = html.replace(/\.mobile-nav-item\.active \{[\s\S]*?color: var\(--primary-color\);\s*\}/g, `.mobile-nav-item.active {
      color: var(--primary-color);
      transform: translateY(-2px);
      text-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .mobile-nav-item:active {
      transform: scale(0.92);
    }`);

fs.writeFileSync("d:/MY-AI-AGENTS/sklepSC/index.html", html, "utf8");
console.log("Successfully fixed mobile UI bugs!");

