import os

index_path = "index.html"
with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

old_h1_style = """    .slide-banner-box h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 34px;
      font-weight: 700;
      margin-bottom: 6px;
      color: var(--white);
      letter-spacing: -0.3px;
      opacity: 0;
      transform: translateY(15px);
      transition: opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
      white-space: nowrap;
    }"""

new_h1_style = """    .slide-banner-box h1 {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(20px, 3.2vw, 30px);
      font-weight: 800;
      margin-bottom: 8px;
      color: var(--white);
      letter-spacing: -0.3px;
      text-shadow: 0 4px 14px rgba(0, 0, 0, 0.75), 0 1px 4px rgba(0, 0, 0, 0.9);
      opacity: 0;
      transform: translateY(15px);
      transition: opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
      white-space: normal;
      line-height: 1.25;
    }

    .slide-banner-box p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.95);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      margin-bottom: 0;
      opacity: 0;
      transform: translateY(15px);
      transition: opacity 0.8s ease 0.7s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
    }"""

if old_h1_style in content:
    content = content.replace(old_h1_style, new_h1_style)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated index.html hero text styles.")
else:
    print("Warning: old_h1_style not found exactly in index.html.")
