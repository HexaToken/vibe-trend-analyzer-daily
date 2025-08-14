/* ===== THEME LOCK UTILITY ===== */
/* 🔒 This utility ensures the light theme force class is always applied */

export const applyThemeLock = (themeMode: string) => {
  if (typeof document === 'undefined') return;
  
  const body = document.body;
  const html = document.documentElement;
  
  if (themeMode === 'light') {
    // Add light theme force classes
    body.classList.add('light-theme-force');
    html.classList.add('light-theme-force');
    
    // Remove dark mode classes
    body.classList.remove('dark');
    html.classList.remove('dark');
    
    // Add light class
    body.classList.add('light');
    html.classList.add('light');
  } else {
    // Remove light theme force classes in dark mode
    body.classList.remove('light-theme-force');
    html.classList.remove('light-theme-force');
    body.classList.remove('light');
    html.classList.remove('light');
  }
};

// Ensure theme lock is applied on page load
export const initializeThemeLock = () => {
  if (typeof document === 'undefined') return;
  
  // Check current theme and apply appropriate classes
  const isDarkMode = document.documentElement.classList.contains('dark');
  const themeMode = isDarkMode ? 'dark' : 'light';
  
  applyThemeLock(themeMode);
  
  // Watch for theme changes and reapply lock
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        const currentTheme = isDark ? 'dark' : 'light';
        applyThemeLock(currentTheme);
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  return observer;
};

// Force theme variables to be available globally
export const injectThemeVariables = () => {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = `
    /* Force theme variables injection */
    html:not(.dark), html.light, body:not(.dark), body.light {
      --color-overall-mood: #3A7AFE !important;
      --color-stocks: #22AB94 !important;
      --color-news: #7B61FF !important;
      --color-social: #F23645 !important;
      --color-positive-text: #22AB94 !important;
      --color-negative-text: #F23645 !important;
      --color-neutral-text: #4B5563 !important;
      --color-background: #FFFFFF !important;
      --color-card-background: #FAFAFA !important;
      --color-border: #E6E6E6 !important;
      --color-hover-background: #F3F4F6 !important;
      --color-gridline: #EFEFEF !important;
      --color-axis: #4B5563 !important;
      --color-text-primary: #1A1A1A !important;
      --color-text-secondary: #4B5563 !important;
      --color-text-muted: #9CA3AF !important;
    }
  `;
  
  document.head.appendChild(style);
};
