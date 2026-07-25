
const fs = require("fs");
let html = fs.readFileSync("d:/MY-AI-AGENTS/sklepSC/index.html", "utf8");

html = html.replace(/<div class="banner-text">[\s\S]*?<\/div>/g, (match, offset) => {
  if (offset > 4300 && offset < 4500) {
    if (match.includes("Salonu") || match.includes("Elegancja") || match.includes("RGB")) {
      return `<div class="banner-text">\n        <h1>O\u015bwietlenie Salonu</h1>\n        <p>Ta\u015bmy LED RGB i Mono do pod\u015bwietle\u0144</p>\n      </div>`;
    }
    if (match.includes("Blat") || match.includes("Kuchenny")) {
      return `<div class="banner-text">\n        <h1>O\u015bwietlenie Blat\u00f3w</h1>\n        <p>Jasne ta\u015bmy COB i profile meblowe</p>\n      </div>`;
    }
    if (match.includes("Biuro")) {
      return `<div class="banner-text">\n        <h1>Nowoczesne Biuro</h1>\n        <p>Liniowe systemy \u015bwietlne i profile architektoniczne</p>\n      </div>`;
    }
    if (match.includes("Schod")) {
      return `<div class="banner-text">\n        <h1>O\u015bwietlenie Schodowe</h1>\n        <p>Cyfrowe ta\u015bmy LED i czujniki ruchu</p>\n      </div>`;
    }
    if (match.includes("SPA") || match.includes("azienka")) {
      return `<div class="banner-text">\n        <h1>\u0141azienka i SPA</h1>\n        <p>Wodoodporne ta\u015bmy LED w silikonie (IP67)</p>\n      </div>`;
    }
  }
  return match;
});

fs.writeFileSync("d:/MY-AI-AGENTS/sklepSC/index.html", html, "utf8");
console.log("Replaced fonts.");

