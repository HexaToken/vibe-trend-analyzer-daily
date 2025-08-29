import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeClickFix, testClickDetection } from './utils/clickFix'

// Initialize click fix immediately
initializeClickFix();

// Test click detection after DOM loads
setTimeout(() => {
  testClickDetection();
  console.log('Click fix initialized - testing navigation clicks...');
}, 1000);

createRoot(document.getElementById("root")!).render(<App />);
