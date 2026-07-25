import os
import codecs
import re
import glob

workspace = r'd:\MY-AI-AGENTS\sklepSC'

new_footer_html = """
<footer class="mockup-footer premium-footer">
  <div class="footer-grid">
    <div class="footer-col brand-col">
      <div class="footer-logo">
        <img alt="Prescot Logo" src="images/logo-white.png" />
      </div>
      <p class="brand-desc">Tworzymy oświetlenie jutra. Prescot LED to bezkompromisowa jakość, zaawansowana technologia COB i inteligentne systemy sterowania światłem dla profesjonalistów.</p>
      <div class="social-links">
        <a href="#"><i class="ph ph-facebook-logo"></i></a>
        <a href="#"><i class="ph ph-instagram-logo"></i></a>
        <a href="#"><i class="ph ph-youtube-logo"></i></a>
      </div>
    </div>
    <div class="footer-col">
      <h3>Odkryj</h3>
      <ul>
        <li><a href="shop.html">Produkty Premium</a></li>
        <li><a href="configurator.html">Dobierz System AI</a></li>
        <li><a href="#">Bestsellery</a></li>
        <li><a href="#">Nowości 2026</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Wsparcie</h3>
      <ul>
        <li><a href="contact.html">Kontakt & Pomoc</a></li>
        <li><a href="#">Gwarancja 5 Lat</a></li>
        <li><a href="#">Baza Wiedzy</a></li>
        <li><a href="#">Polityka Prywatności</a></li>
      </ul>
    </div>
    <div class="footer-col contact-col">
      <h3>Kontakt</h3>
      <ul class="contact-info">
        <li><i class="ph ph-envelope-simple"></i> kontakt@prescot.com.pl</li>
        <li><i class="ph ph-phone"></i> +48 22 123 45 67</li>
        <li><i class="ph ph-map-pin"></i> ul. Przykładowa 12, 00-001 Warszawa</li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 PRESCOT LED. Wszelkie prawa zastrzeżone.</p>
    <div class="payment-methods">
      <i class="ph ph-stripe-logo"></i>
      <i class="ph ph-paypal-logo"></i>
    </div>
  </div>
</footer>
"""

global_css_overrides = """
<style id="global-premium-overrides">
/* Premium Footer CSS */
.premium-footer {
  background: var(--primary-color, #0b1a30) !important;
  color: #fff !important;
  padding: 80px 8% 40px !important;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-family: 'Outfit', sans-serif;
  margin-top: auto;
}
.premium-footer .footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 60px;
  margin-bottom: 60px;
}
.premium-footer .footer-logo img {
  height: 38px !important;
  opacity: 1 !important;
  margin-bottom: 25px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
}
.premium-footer .brand-desc {
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
  font-size: 15px;
  margin-bottom: 25px;
}
.premium-footer .social-links {
  display: flex;
  gap: 15px;
}
.premium-footer .social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  transition: all 0.3s ease;
}
.premium-footer .social-links a:hover {
  background: var(--accent-color, #ff5e00);
  transform: translateY(-3px);
}
.premium-footer h3 {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 25px;
  letter-spacing: 1px;
}
.premium-footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.premium-footer ul li {
  margin-bottom: 12px;
}
.premium-footer ul li a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}
.premium-footer ul li a:hover {
  color: #fff;
  transform: translateX(5px);
}
.premium-footer .contact-info li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: rgba(255,255,255,0.7);
  font-size: 15px;
  line-height: 1.6;
}
.premium-footer .contact-info i {
  font-size: 20px;
  color: var(--accent-color, #ff5e00);
  margin-top: 2px;
}
.premium-footer .footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  font-size: 13px;
}
.premium-footer .payment-methods {
  display: flex;
  gap: 15px;
  font-size: 24px;
  color: rgba(255,255,255,0.5);
}
@media (max-width: 992px) {
  .premium-footer .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}
@media (max-width: 768px) {
  .premium-footer .footer-grid {
    grid-template-columns: 1fr;
    gap: 35px;
  }
  .premium-footer .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}

/* Logo Header Fix */
.site-header .brand {
  display: flex !important;
  align-items: center !important;
  height: 100%;
}
.site-header .brand img {
  height: 40px !important;
  max-width: none !important;
  object-fit: contain !important;
  transform: translateY(2px);
}
@media (max-width: 768px) {
  .site-header .brand img {
    height: 32px !important;
  }
}
</style>
"""

html_files = glob.glob(os.path.join(workspace, '*.html'))

for file_path in html_files:
    if "original" in file_path or "old" in file_path or "59840a7" in file_path or "58efa07" in file_path:
        continue
        
    with codecs.open(file_path, 'r', 'utf-8') as f:
        content = f.read()
        
    # Replace Footer
    content = re.sub(r'<footer.*?</footer>', new_footer_html, content, flags=re.DOTALL)
    
    # Inject Global CSS
    if '<style id="global-premium-overrides">' not in content:
        content = content.replace('</head>', f'{global_css_overrides}\n</head>')
        
    with codecs.open(file_path, 'w', 'utf-8') as f:
        f.write(content)

print("Applied footer redesign and logo fix across all HTML files.")
