import codecs
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

with codecs.open(f'{workspace}/index.html', 'r', 'utf-8') as f:
    content = f.read()

# Remove 'loop' from video tags to allow them to end naturally if the browser permits
content = content.replace('muted autoplay loop playsinline', 'muted autoplay playsinline')

# Update the JS logic to force a 5000ms timeout
old_js_block = """        if (activeVideo) {
          activeVideo.currentTime = 0;
          
          // Listen for ended event to switch slides immediately
          activeVideo.onended = () => {
            showSlide(currentSlide + 1);
          };
  
          // Try playing video and calculate transition duration
          activeVideo.play()
            .then(() => {
              if (activeVideo.duration) {
                fallbackDuration = activeVideo.duration * 1000;
                resetTimeout(fallbackDuration);
              } else {
                activeVideo.onloadedmetadata = () => {
                  fallbackDuration = activeVideo.duration * 1000;
                  resetTimeout(fallbackDuration);
                };
              }
            })
            .catch(err => {
              console.log("Autoplay blocked, using fallback:", err);
              resetTimeout(10000);
            });
        }"""

new_js_block = """        if (activeVideo) {
          activeVideo.currentTime = 0;
          
          activeVideo.onended = () => {
            showSlide(currentSlide + 1);
          };
  
          activeVideo.play().catch(err => {
            console.log("Autoplay blocked:", err);
          });
          
          // Force 5 seconds interval unconditionally as per requirement
          resetTimeout(5000);
        } else {
          resetTimeout(5000);
        }"""

content = content.replace(old_js_block, new_js_block)

with codecs.open(f'{workspace}/index.html', 'w', 'utf-8') as f:
    f.write(content)

print("Fixed slider timeout to 5 seconds")
