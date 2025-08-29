/**
 * Emergency click fix to disable Replit beacon debugging overlays
 * This script forcibly removes any elements blocking user interactions
 */

export const initializeClickFix = () => {
  // Remove all beacon elements immediately
  const removeBeaconElements = () => {
    const beaconSelectors = [
      '.beacon-highlighter',
      '.beacon-selected-highlighter', 
      '.beacon-hover-highlighter',
      '.beacon-sibling-highlighter',
      '.beacon-label',
      '.beacon-hover-label',
      '.beacon-selected-label',
      '[class*="beacon"]',
      '[id*="beacon"]'
    ];

    beaconSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    });

    // Remove any elements with extremely high z-index that might be blocking
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const zIndex = parseInt(style.zIndex);
      if (zIndex > 999999) {
        (el as HTMLElement).style.display = 'none';
        (el as HTMLElement).style.pointerEvents = 'none';
      }
    });
  };

  // Force all elements to accept clicks
  const forceClickable = () => {
    const clickableSelectors = [
      'button',
      'a', 
      '[role="button"]',
      'nav *',
      'header *',
      '.nav *',
      '.header *'
    ];

    clickableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        (el as HTMLElement).style.pointerEvents = 'auto';
        (el as HTMLElement).style.cursor = 'pointer';
        (el as HTMLElement).style.zIndex = '9999';
        (el as HTMLElement).style.position = 'relative';
      });
    });
  };

  // Override any beacon initialization
  const disableBeacons = () => {
    // Block beacon system if it exists
    (window as any).beacon = null;
    (window as any).beaconHighlighter = null;
    
    // Override any beacon methods
    ['addEventListener', 'attachEvent'].forEach(method => {
      if ((document as any)[method]) {
        const original = (document as any)[method];
        (document as any)[method] = function(event: string, handler: Function, ...args: any[]) {
          if (event.includes('beacon') || event.includes('highlight')) {
            return; // Block beacon event listeners
          }
          return original.call(this, event, handler, ...args);
        };
      }
    });
  };

  // Run fixes immediately and continuously
  removeBeaconElements();
  forceClickable();
  disableBeacons();

  // Re-run every 100ms to catch dynamically added elements
  const interval = setInterval(() => {
    removeBeaconElements();
    forceClickable();
  }, 100);

  // Also run on DOM mutations
  const observer = new MutationObserver(() => {
    removeBeaconElements();
    forceClickable();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'z-index']
  });

  // Return cleanup function
  return () => {
    clearInterval(interval);
    observer.disconnect();
  };
};

// Test click detection
export const testClickDetection = () => {
  console.log('Click detection test - this should appear in console');
  
  // Add click listeners to common elements
  const testElements = document.querySelectorAll('button, a, [role="button"], nav *, header *');
  testElements.forEach((el, index) => {
    el.addEventListener('click', (e) => {
      console.log(`Click detected on element ${index}:`, el);
      e.stopPropagation();
    }, true);
  });
};