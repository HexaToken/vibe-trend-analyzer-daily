import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeClickFix, testClickDetection } from './utils/clickFix'
import { runSystemClickTest } from './utils/systemClickTest'

// Initialize click fix immediately
initializeClickFix();

// Run comprehensive system tests
setTimeout(() => {
  testClickDetection();
  console.log('Click fix initialized - running comprehensive system test...');
  
  // Run full system click test after React renders
  setTimeout(() => {
    runSystemClickTest();
  }, 2000);
}, 1000);

createRoot(document.getElementById("root")!).render(<App />);
