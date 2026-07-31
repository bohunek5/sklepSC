import re

with open('product.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add styles for zoom
if 'sixtyScale' not in content:
    js_addition = """
    // --- Zoom and Pan Logic for 360 Viewer ---
    let sixtyScale = 1;
    let sixtyPanX = 0;
    let sixtyPanY = 0;
    let isPanningSixty = false;
    let startPanX = 0;
    let startPanY = 0;
    let initialPinchDistance = null;

    sixtyImg.style.transformOrigin = 'center center';
    sixtyImg.style.transition = 'transform 0.1s ease-out';

    function updateSixtyTransform() {
      sixtyImg.style.transform = `translate(${sixtyPanX}px, ${sixtyPanY}px) scale(${sixtyScale})`;
    }

    sixtyViewerContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      sixtyScale += e.deltaY * -0.005;
      sixtyScale = Math.min(Math.max(1, sixtyScale), 5);
      if (sixtyScale === 1) { sixtyPanX = 0; sixtyPanY = 0; }
      updateSixtyTransform();
    }, {passive: false});

    // We need to differentiate between rotating (drag) and panning (if zoomed in, maybe drag should pan instead of rotate? 
    // Or drag with 2 fingers to pan. Let's do: if zoomed in, 1-finger drag pans, 2-finger pinch zooms.
    // To rotate when zoomed in, we can provide buttons or require zooming out first.
    // Actually, typical 360 viewer: horizontal drag rotates, but if zoomed, maybe we can just let it rotate, and double-click to zoom in/out.
    sixtyViewerContainer.addEventListener('dblclick', (e) => {
      if (sixtyScale > 1) {
        sixtyScale = 1;
        sixtyPanX = 0;
        sixtyPanY = 0;
      } else {
        sixtyScale = 2.5;
      }
      updateSixtyTransform();
    });

    sixtyViewerContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        isDraggingSixty = false;
        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    sixtyViewerContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDistance) {
        e.preventDefault();
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = currentDistance - initialPinchDistance;
        sixtyScale += diff * 0.01;
        sixtyScale = Math.min(Math.max(1, sixtyScale), 5);
        if (sixtyScale === 1) { sixtyPanX = 0; sixtyPanY = 0; }
        initialPinchDistance = currentDistance;
        updateSixtyTransform();
      }
    }, {passive: false});

    sixtyViewerContainer.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        initialPinchDistance = null;
      }
    });
    """

    # We will insert it after "let activeSixtyIndex = 1;"
    content = content.replace('let activeSixtyIndex = 1;', 'let activeSixtyIndex = 1;\n' + js_addition)
    
    # Let's also modify the drag logic so that if sixtyScale > 1, dragging pans instead of rotates
    old_mouse_move = """    window.addEventListener('mousemove', (e) => {
      if (!isDraggingSixty) return;
      const diffX = e.clientX - startSixtyX;
      if (Math.abs(diffX) > 12) {
        if (diffX > 0) {
          showSixtyImage(activeSixtyIndex - 1);
        } else {
          showSixtyImage(activeSixtyIndex + 1);
        }
        startSixtyX = e.clientX;
      }
    });"""

    new_mouse_move = """    window.addEventListener('mousemove', (e) => {
      if (!isDraggingSixty) return;
      if (sixtyScale > 1) {
        const dx = e.clientX - startSixtyX;
        const dy = e.movementY;
        sixtyPanX += dx;
        sixtyPanY += dy;
        startSixtyX = e.clientX;
        updateSixtyTransform();
        return;
      }
      const diffX = e.clientX - startSixtyX;
      if (Math.abs(diffX) > 12) {
        if (diffX > 0) {
          showSixtyImage(activeSixtyIndex - 1);
        } else {
          showSixtyImage(activeSixtyIndex + 1);
        }
        startSixtyX = e.clientX;
      }
    });"""
    content = content.replace(old_mouse_move, new_mouse_move)
    
    old_touch_move = """    sixtyViewerContainer.addEventListener('touchmove', (e) => {
      if (!isDraggingSixty) return;
      const diffX = e.touches[0].clientX - startSixtyX;
      if (Math.abs(diffX) > 12) {
        if (diffX > 0) {
          showSixtyImage(activeSixtyIndex - 1);
        } else {
          showSixtyImage(activeSixtyIndex + 1);
        }
        startSixtyX = e.touches[0].clientX;
      }
    });"""

    new_touch_move = """    sixtyViewerContainer.addEventListener('touchmove', (e) => {
      if (!isDraggingSixty || e.touches.length > 1) return;
      if (sixtyScale > 1) {
        const dx = e.touches[0].clientX - startSixtyX;
        sixtyPanX += dx;
        // Basic touch pan logic for Y can also be added if we store startSixtyY
        startSixtyX = e.touches[0].clientX;
        updateSixtyTransform();
        e.preventDefault(); // Prevent scrolling when panning
        return;
      }
      const diffX = e.touches[0].clientX - startSixtyX;
      if (Math.abs(diffX) > 12) {
        if (diffX > 0) {
          showSixtyImage(activeSixtyIndex - 1);
        } else {
          showSixtyImage(activeSixtyIndex + 1);
        }
        startSixtyX = e.touches[0].clientX;
      }
    }, {passive: false});"""
    content = content.replace(old_touch_move, new_touch_move)

    with open('product.html', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Updated product.html with zoom/pan logic.")
else:
    print("Logic already exists or something went wrong.")

