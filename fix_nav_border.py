import re
import glob

# The CSS snippet with the animation logic
nav_css = '''<style id="global-config-nav-css">
@property --nav-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes nav-spin {
  0% { --nav-angle: 0deg; }
  100% { --nav-angle: 360deg; }
}

.config-bottom-nav { display: none; }
@media (max-width: 768px) {
  .config-bottom-nav { 
    position: fixed; inset: auto 0 0; z-index: 950; height: 76px; 
    display: grid; grid-template-columns: repeat(5,1fr); 
    padding: 7px 8px calc(6px + env(safe-area-inset-bottom)); 
    border-top: 1px solid rgba(255,255,255,0.1); 
    background: rgba(6,16,28,.95); 
    backdrop-filter: blur(24px) saturate(180%); 
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.4);
  }
  
  /* The Animated Border */
  .config-bottom-nav::before {
    content: '';
    position: absolute;
    inset: -2px 0 0 0; /* Only top border glow */
    background: conic-gradient(
        from var(--nav-angle), 
        transparent 10%, #00e5ff 25%, 
        transparent 35%, #ff0055 50%, 
        transparent 60%, #00e5ff 75%, 
        transparent 85%, #ff0055 100%
    );
    animation: nav-spin 4s linear infinite;
    z-index: -1;
    opacity: 0.9;
  }
  
  .config-bottom-nav a, .config-bottom-nav button { 
    min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 0; border: 0; 
    color: rgba(255,255,255,.6); background: transparent; text-decoration: none; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;
  }
  .config-bottom-nav i { font-size: 22px; margin-bottom: 2px; transition: all 0.3s ease; }
  .config-bottom-nav a:hover, .config-bottom-nav button:hover { color: #fff; }
  .config-bottom-nav .active { color: #fff; }
  
  .bottom-main-icon { 
    width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; 
    margin-top: -24px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; color: #fff; 
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.0)); 
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  .bottom-main-icon i { font-size: 24px; margin-bottom: 0; }
  .config-bottom-nav .active .bottom-main-icon {
    border: 2px solid #00e5ff;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
    background: rgba(0, 229, 255, 0.1);
    color: #00e5ff;
  }
  
  .site-header.scrolled .header-icon svg, .mockup-header.scrolled .header-icon svg {
    stroke: #0b1a30 !important;
  }
  .menu-toggle, .menu-button {
    display: block !important;
  }
}
</style>'''

files = glob.glob('*.html')
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the old style block
    pattern = r'<style id="global-config-nav-css">.*?</style>'
    new_content = re.sub(pattern, nav_css, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

