import re

with open('product.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add VR button to action bar
action_bar_vr = """
      if (product.hasVR) {
        items.push(`
          <button class="product-action-item" id="actionBarVRBtn">
            <i class="ph ph-virtual-reality"></i>
            <span>Model VR</span>
          </button>
        `);
      }
"""
content = re.sub(r'(// 4\. Widok 360.*?if \(product\.has360\) \{.*?\}\n)', r'\1' + action_bar_vr, content, flags=re.DOTALL)

# 2. Add VR viewer container
vr_container = """
<!-- VR Viewer Container -->
<div id="vrViewerContainer" style="display: none; width: 100%; height: 100%; min-height: 500px; position: relative; overflow: hidden; background: #fff; cursor: all-scroll; align-items: center; justify-content: center;">
  <img alt="VR View" id="vrImg" src="" style="max-width: 100%; max-height: 100%; object-fit: contain; pointer-events: none;"/>
  <div class="product-360__loading" id="vrLoading" style="position: absolute; background: rgba(255,255,255,0.9); padding: 15px 30px; border-radius: 30px; font-weight: 600; box-shadow: 0 5px 15px rgba(0,0,0,0.1); font-size: 13px;">
    Wczytywanie VR...</div>
  <div class="product-360__controls" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; background: rgba(255,255,255,0.9); padding: 8px 15px; border-radius: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); z-index: 10; align-items: center;">
    <span style="font-size: 12px; font-weight: 600;">Przesuwaj w lewo/prawo i w górę/dół</span>
  </div>
</div>
"""
content = content.replace('<!-- 360 Viewer Container -->', vr_container + '\n<!-- 360 Viewer Container -->')

# 3. Add triggerVR to media triggers
media_trigger = '<button class="media-trigger-btn" id="triggerVR" style="display: none;"><i class="ph ph-virtual-reality" style="font-size:16px;"></i> Model VR</button>\n'
content = content.replace('<button class="media-trigger-btn" id="trigger360"', media_trigger + '<button class="media-trigger-btn" id="trigger360"')

# 4. Add JS logic for VR
# Find the end of the script or the 360 logic to append VR logic
vr_js_logic = """
    // --- VR Logic ---
    const triggerVR = document.getElementById('triggerVR');
    const vrViewerContainer = document.getElementById('vrViewerContainer');
    const vrImg = document.getElementById('vrImg');
    const vrLoading = document.getElementById('vrLoading');
    const actionBarVRBtn = document.getElementById('actionBarVRBtn');
    
    let currentVrX = 0; // 0 to 35
    let currentVrY = 0; // 0 (front) or 1 (back)
    let isDraggingVr = false;
    let startXvr = 0;
    let startYvr = 0;
    
    function updateVrImage() {
        if (!product.images360Pattern) return;
        const index = currentVrY * 36 + currentVrX + 1; // 1 to 72
        vrImg.src = product.images360Pattern.replace('{index}', index);
    }

    if (product.hasVR) {
        if (triggerVR) triggerVR.style.display = 'flex';
        if (actionBarVRBtn) actionBarVRBtn.addEventListener('click', () => triggerVR && triggerVR.click());
        
        // Preload VR images (first few)
        if (product.images360Pattern) {
           [1, 2, 36, 37].forEach(i => {
               const img = new Image();
               img.src = product.images360Pattern.replace('{index}', i);
           });
        }
    } else {
        if (triggerVR) triggerVR.style.display = 'none';
    }

    if (triggerVR) {
        triggerVR.addEventListener('click', () => {
            // Hide others
            mainImageContainer.style.display = 'none';
            if (mainVideo) mainVideo.style.display = 'none';
            if (modelViewerContainer) modelViewerContainer.style.display = 'none';
            if (sixtyViewerContainer) sixtyViewerContainer.style.display = 'none';
            
            // Show VR
            vrViewerContainer.style.display = 'flex';
            
            document.querySelectorAll('.media-trigger-btn').forEach(btn => btn.classList.remove('active'));
            triggerVR.classList.add('active');
            
            vrLoading.style.display = 'none';
            updateVrImage();
        });
    }

    if (vrViewerContainer) {
        const handleDragStartVr = (e) => {
            isDraggingVr = true;
            startXvr = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            startYvr = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
            vrViewerContainer.style.cursor = 'grabbing';
        };

        const handleDragMoveVr = (e) => {
            if (!isDraggingVr) return;
            e.preventDefault();
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            const currentY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
            const diffX = currentX - startXvr;
            const diffY = currentY - startYvr;
            
            // Sensitivity
            if (Math.abs(diffX) > 15) {
                if (diffX > 0) currentVrX = (currentVrX - 1 + 36) % 36;
                else currentVrX = (currentVrX + 1) % 36;
                startXvr = currentX;
                updateVrImage();
            }
            if (Math.abs(diffY) > 50) {
                if (diffY > 0) currentVrY = 0; // drag down -> front
                else currentVrY = 1; // drag up -> back
                startYvr = currentY;
                updateVrImage();
            }
        };

        const handleDragEndVr = () => {
            isDraggingVr = false;
            vrViewerContainer.style.cursor = 'all-scroll';
        };

        vrViewerContainer.addEventListener('mousedown', handleDragStartVr);
        window.addEventListener('mousemove', handleDragMoveVr);
        window.addEventListener('mouseup', handleDragEndVr);
        
        vrViewerContainer.addEventListener('touchstart', handleDragStartVr, {passive: false});
        window.addEventListener('touchmove', handleDragMoveVr, {passive: false});
        window.addEventListener('touchend', handleDragEndVr);
    }
"""
content = content.replace('// 3. 360 Degree Rotation Logic', vr_js_logic + '\n    // 3. 360 Degree Rotation Logic')

with open('product.html', 'w', encoding='utf-8') as f:
    f.write(content)
