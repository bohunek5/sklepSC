
const fs = require("fs");
let html = fs.readFileSync("d:/MY-AI-AGENTS/sklepSC/index.html", "utf8");

// 1. Remove loop and poster from slider videos
html = html.replace(/<video class="slide-video desktop-bg" poster="[^"]+" muted loop playsinline preload="auto" src="([^"]+)" style="width: 100%; height: 100%; object-fit: cover;"><\/video>/g, `<video class="slide-video desktop-bg" muted playsinline preload="auto" src="$1" style="width: 100%; height: 100%; object-fit: cover;"></video>`);
html = html.replace(/<video class="slide-video mobile-bg" poster="[^"]+" muted loop playsinline preload="auto" src="([^"]+)" style="width: 100%; height: 100%; object-fit: cover;"><\/video>/g, `<video class="slide-video mobile-bg" muted playsinline preload="auto" src="$1" style="width: 100%; height: 100%; object-fit: cover;"></video>`);

// 2. Fix texts (handling potential bad encoding)
html = html.replace(/<h1>Salon & Elegancja<\/h1>\s*<p>.*?<\/p>/, `<h1>Oœwietlenie Salonu</h1>\n        <p>Taœmy LED RGB i Mono do podœwietleñ</p>`);
html = html.replace(/<h1>Kuchenny Minimalizm<\/h1>\s*<p>.*?<\/p>/, `<h1>Oœwietlenie Blatów</h1>\n        <p>Jasne taœmy COB i profile meblowe</p>`);
html = html.replace(/<h1>Nowoczesne Biuro<\/h1>\s*<p>.*?<\/p>/, `<h1>Nowoczesne Biuro</h1>\n        <p>Liniowe systemy œwietlne i profile architektoniczne</p>`);
html = html.replace(/<h1[^>]*>O.*?wietlenie Schod.*?w<\/h1>\s*<p>.*?<\/p>/, `<h1>Oœwietlenie Schodowe</h1>\n        <p>Cyfrowe taœmy LED i czujniki ruchu</p>`);
html = html.replace(/<h1>Spa & Relaks<\/h1>\s*<p>.*?<\/p>/, `<h1>£azienka i SPA</h1>\n        <p>Wodoodporne taœmy LED w silikonie (IP67)</p>`);

// 3. Fix mobile-bg CSS
html = html.replace(/\.mobile-bg \{\s*display: block !important;\s*\}/, `.mobile-bg {\n        display: block !important;\n        object-fit: cover !important;\n        object-position: center !important;\n      }`);

fs.writeFileSync("d:/MY-AI-AGENTS/sklepSC/index.html", html, "utf8");
console.log("Done");

