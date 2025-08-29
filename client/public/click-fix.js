// Emergency click fix - standalone JavaScript file
// This runs before React and completely disables beacon system

console.log('CLICK FIX: Initializing emergency click fix...');

// Disable beacon system completely
window.beaconEnabled = false;
window.beacon = null;
window.beaconHighlighter = null;

// Override any beacon methods
if (window.BeaconHighlighter) {
  window.BeaconHighlighter = null;
}

// Block createElement for beacon elements
const originalCreateElement = document.createElement.bind(document);
document.createElement = function(tagName) {
  const element = originalCreateElement(tagName);
  
  // Block beacon elements
  const observer = new MutationObserver(() => {
    if (element.className && element.className.includes('beacon')) {
      element.remove();
    }
  });
  
  observer.observe(element, { attributes: true, attributeFilter: ['class'] });
  
  return element;
};

// Aggressive style injection
const emergencyStyles = `
  /* EMERGENCY CLICK FIX */
  * {
    pointer-events: auto !important;
  }
  
  /* Hide all beacon elements */
  .beacon-highlighter,
  .beacon-selected-highlighter,
  .beacon-hover-highlighter,
  .beacon-sibling-highlighter,
  .beacon-label,
  .beacon-hover-label,
  .beacon-selected-label,
  [class*="beacon"],
  [id*="beacon"],
  [data-beacon] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    z-index: -99999 !important;
    opacity: 0 !important;
  }
  
  /* Force clickable elements */
  button, a, input, select, textarea,
  [role="button"], [role="menuitem"], [role="tab"],
  nav, nav *, header, header *, .nav, .nav *, .header, .header *,
  .menu, .menu *, .btn, .btn *,
  div[onclick], span[onclick], li[onclick] {
    pointer-events: auto !important;
    cursor: pointer !important;
    z-index: 99999 !important;
    position: relative !important;
  }
  
  /* Block extremely high z-index elements */
  [style*="z-index: 9007199254740991"],
  [style*="z-index: 2147483647"] {
    display: none !important;
    pointer-events: none !important;
  }
`;

// Inject styles immediately
const styleEl = document.createElement('style');
styleEl.textContent = emergencyStyles;
document.head.appendChild(styleEl);

// Continuous beacon removal
const removeBeacons = () => {
  const beaconElements = document.querySelectorAll(`
    .beacon-highlighter,
    .beacon-selected-highlighter,
    .beacon-hover-highlighter,
    .beacon-sibling-highlighter,
    .beacon-label,
    .beacon-hover-label,
    .beacon-selected-label,
    [class*="beacon"],
    [id*="beacon"]
  `);
  
  beaconElements.forEach(el => {
    try {
      el.remove();
    } catch (e) {
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
    }
  });
  
  // Check for high z-index blocking elements
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    const zIndex = parseInt(style.zIndex);
    if (zIndex > 999999) {
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
    }
  });
};

// Run removal every 50ms
setInterval(removeBeacons, 50);

// Run on DOM changes
const observer = new MutationObserver(removeBeacons);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class', 'style']
});

console.log('CLICK FIX: Emergency click fix activated!');

// Test function
window.testClickFix = () => {
  console.log('Click fix test - if you see this, JavaScript is working');
  alert('Click fix is active!');
};