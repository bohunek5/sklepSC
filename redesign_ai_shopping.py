import re

file_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update CSS
css_pattern = r'<style>.*?</style>'
new_css = """<style>
    /* Futuristic AI Chat Design - LLM Style */
    body {
      background: #0f172a; /* Ciemny, elegancki granat podobny do IDE/LLM */
      color: #fff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      margin: 0;
    }
    
    .site-header {
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .ai-hero {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end; /* Chat box starts near bottom or stretches */
      padding: 100px 20px 40px;
      z-index: 1;
      min-height: calc(100vh - 75px);
    }

    /* Watermark background */
    .ai-hero::before {
      content: '';
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60vw;
      height: 60vw;
      max-width: 600px;
      max-height: 600px;
      background: url('images/logo-white.png') center/contain no-repeat;
      opacity: 0.02; /* Bardzo delikatny znak wodny */
      z-index: -1;
      pointer-events: none;
    }

    /* Chat window styled like a pro LLM */
    .ai-chat-interface {
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1;
    }

    .chat-history {
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex: 1;
      overflow-y: auto;
      padding: 20px 0 40px;
    }

    .chat-history::-webkit-scrollbar {
      width: 6px;
    }
    .chat-history::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
    }

    .chat-message {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      animation: fadeInUp 0.4s ease forwards;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-ai {
      background: #ff5a00;
      color: #fff;
    }

    .avatar-user {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .message-bubble {
      padding: 0;
      font-size: 15px;
      line-height: 1.6;
      color: #e2e8f0;
      flex: 1;
      margin-top: 4px;
    }

    /* AI input styled like LLM prompt box */
    .ai-input-area {
      position: relative;
      margin-top: auto;
      background: #1e293b;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    .ai-input-area input {
      width: 100%;
      background: transparent;
      border: none;
      padding: 12px 50px 12px 16px;
      color: #fff;
      font-size: 15px;
      font-family: 'Inter', sans-serif;
      outline: none;
    }

    .ai-input-area input::placeholder {
      color: #64748b;
    }

    .ai-input-area button {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #ff5a00;
      border: none;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
    }

    .ai-input-area button:hover {
      background: #ff7a33;
    }

    /* Glow effect for menu link */
    .desktop-nav a.ai-glow-link {
      background: linear-gradient(90deg, #ff5a00, #ff9a64);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      position: relative;
    }
  </style>"""

html = re.sub(css_pattern, new_css, html, flags=re.DOTALL)

# 2. Update Body (remove hero text)
body_pattern = r'<section class="ai-hero">.*?(<div class="ai-chat-interface">)'
new_body = """<section class="ai-hero">
      <div class="ai-chat-interface">"""

html = re.sub(body_pattern, new_body, html, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated ai-shopping.html design to look like an LLM.")
