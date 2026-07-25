import re
import codecs

with codecs.open('d:/MY-AI-AGENTS/sklepSC/ai-shopping.html', 'r', 'utf-8') as f:
    html = f.read()

# Replace the ai-input-area CSS
old_input_css_regex = r"\.ai-input-area \{.*?\/\* Glow effect for menu link \*\/"
old_halo_css_regex = r"\.ai-input-area \{[\s\S]*?@keyframes spinHalo \{[\s\S]*?\}"

new_css = """
    /* --- AI STUDIO GOOGLE STYLE INPUT BAR --- */
    .ai-input-area {
      position: relative;
      margin-top: auto;
      background: #1e293b; /* Base dark background */
      border-radius: 30px; /* Fully rounded pill shape like AI Studio */
      padding: 6px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      z-index: 1; /* For the halo pseudo-elements */
    }

    .ai-input-area input {
      width: 100%;
      background: transparent;
      border: none;
      padding: 16px 60px 16px 24px; /* More padding, room for button */
      color: #fff;
      font-size: 16px;
      font-family: 'Inter', sans-serif;
      outline: none;
    }

    .ai-input-area input::placeholder {
      color: #94a3b8;
    }

    /* Send Button */
    .ai-input-area button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 8px;
      width: 44px; /* Larger circular button */
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05); /* Subtle background initially */
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .ai-input-area button:hover {
      background: #e14f27; /* The brand orange */
      border-color: #e14f27;
      box-shadow: 0 4px 15px rgba(225, 79, 39, 0.4);
    }
    
    .ai-input-area button:hover img {
      filter: brightness(0) invert(1);
    }

    /* AI Studio Spinning Halo Effect */
    @property --halo-angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }
    
    .ai-input-area::before {
      content: "";
      position: absolute;
      inset: -2px; /* Slightly thicker border for AI Studio look */
      border-radius: 32px; /* Matches the inner pill */
      padding: 2px; /* Border thickness */
      background: rgba(11, 26, 48, 0.8); /* Dark navy base */
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      transition: opacity 0.4s ease;
      z-index: -1;
    }

    .ai-input-area::after {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 32px;
      padding: 2px;
      background: conic-gradient(
        from var(--halo-angle, 0deg), 
        rgba(5, 12, 25, 1) 0%,         /* Very dark navy */
        rgba(5, 12, 25, 1) 40%, 
        rgba(11, 26, 48, 1) 60%,       /* Deep navy */
        rgba(225, 79, 39, 0.7) 80%,    /* Brand orange fading in */
        #e14f27 95%,                   /* Pure brand orange */
        rgba(5, 12, 25, 1) 100%        /* Seamless loop to dark navy */
      );
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease;
      z-index: -1;
    }

    .ai-input-area.focused::before {
      opacity: 0;
    }
    .ai-input-area.focused::after {
      opacity: 1;
      animation: spinHalo 4s linear infinite; /* Smooth 4s rotation */
    }
    .ai-input-area.focused {
      box-shadow: 0 8px 30px rgba(11, 26, 48, 0.5), 0 0 15px rgba(225, 79, 39, 0.15);
      background: #151e2e; /* Slightly darker background when focused */
    }

    @keyframes spinHalo {
      to { --halo-angle: 360deg; }
    }
    /* --- END AI STUDIO STYLE --- */
"""

# Replace in HTML using regex
html = re.sub(r"\.ai-input-area \{[\s\S]*?@keyframes spinHalo \{\s*to \{ --halo-angle: 360deg; \}\s*\}", new_css, html)

with codecs.open('d:/MY-AI-AGENTS/sklepSC/ai-shopping.html', 'w', 'utf-8') as f:
    f.write(html)
