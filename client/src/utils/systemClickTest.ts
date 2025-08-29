/**
 * Comprehensive system click test utility
 * Tests all interactive elements across the application
 */

interface ClickTestResult {
  element: string;
  selector: string;
  clickable: boolean;
  hasHandler: boolean;
  zIndex: string;
  pointerEvents: string;
  position: string;
}

export class SystemClickTester {
  private results: ClickTestResult[] = [];
  private testCount = 0;

  // Test all interactive elements
  testAllInteractiveElements(): ClickTestResult[] {
    console.log('🔍 Starting comprehensive click system test...');
    
    const selectors = [
      // Navigation elements
      'header button',
      'nav button', 
      'nav a',
      '[role="navigation"] *',
      
      // Common interactive elements
      'button',
      'a[href]',
      'input[type="button"]',
      'input[type="submit"]',
      '[role="button"]',
      '[role="menuitem"]',
      '[role="tab"]',
      '[onclick]',
      
      // Specific component selectors
      '.btn',
      '.button',
      '.nav-item',
      '.menu-item',
      '[data-testid]',
      
      // Form elements
      'input',
      'select', 
      'textarea',
      'label[for]',
      
      // Interactive UI components
      '[aria-expanded]',
      '[aria-haspopup]',
      '[tabindex="0"]',
      '[tabindex="-1"]'
    ];

    this.results = [];
    
    selectors.forEach(selector => {
      this.testSelector(selector);
    });

    this.generateReport();
    return this.results;
  }

  private testSelector(selector: string) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element as Element);
      const hasClickHandler = this.hasClickHandler(element as HTMLElement);
      
      const result: ClickTestResult = {
        element: `${selector}[${index}]`,
        selector,
        clickable: computedStyle.pointerEvents !== 'none',
        hasHandler: hasClickHandler,
        zIndex: computedStyle.zIndex,
        pointerEvents: computedStyle.pointerEvents,
        position: computedStyle.position
      };
      
      this.results.push(result);
      this.testCount++;
    });
  }

  private hasClickHandler(element: HTMLElement): boolean {
    // Check for onclick attribute
    if (element.onclick) return true;
    
    // Check for event listeners (this is limited but gives us some info)
    const events = (element as any)._events || {};
    if (events.click) return true;
    
    // Check for common interactive element types
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    if (interactiveTags.includes(element.tagName.toLowerCase())) return true;
    
    // Check for interactive roles
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab'];
    if (interactiveRoles.includes(element.getAttribute('role') || '')) return true;
    
    return false;
  }

  private generateReport() {
    const total = this.results.length;
    const clickable = this.results.filter(r => r.clickable).length;
    const withHandlers = this.results.filter(r => r.hasHandler).length;
    const problematic = this.results.filter(r => !r.clickable && r.hasHandler).length;
    
    console.log(`\n📊 CLICK SYSTEM TEST RESULTS:`);
    console.log(`Total elements tested: ${total}`);
    console.log(`Clickable elements: ${clickable} (${((clickable/total)*100).toFixed(1)}%)`);
    console.log(`With click handlers: ${withHandlers} (${((withHandlers/total)*100).toFixed(1)}%)`);
    console.log(`Problematic (handler but not clickable): ${problematic}`);
    
    if (problematic > 0) {
      console.warn(`⚠️ Found ${problematic} elements with handlers but blocked clicks:`);
      this.results
        .filter(r => !r.clickable && r.hasHandler)
        .forEach(r => {
          console.warn(`  - ${r.element}: pointer-events: ${r.pointerEvents}, z-index: ${r.zIndex}`);
        });
    }

    // Test high z-index blocking elements
    this.testHighZIndexElements();
  }

  private testHighZIndexElements() {
    const allElements = document.querySelectorAll('*');
    const highZElements: Element[] = [];
    
    allElements.forEach(el => {
      const zIndex = parseInt(window.getComputedStyle(el).zIndex);
      if (zIndex > 999999) {
        highZElements.push(el);
      }
    });
    
    if (highZElements.length > 0) {
      console.warn(`🚨 Found ${highZElements.length} elements with extremely high z-index:`);
      highZElements.forEach((el, i) => {
        const style = window.getComputedStyle(el);
        console.warn(`  ${i}: z-index: ${style.zIndex}, pointer-events: ${style.pointerEvents}, class: ${el.className}`);
      });
    }
  }

  // Interactive test - try clicking specific elements
  performInteractiveTest(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('🎯 Running interactive click test...');
      
      // Find the first visible button
      const testButton = document.querySelector('button:not([disabled])') as HTMLButtonElement;
      
      if (!testButton) {
        console.error('❌ No testable buttons found');
        resolve(false);
        return;
      }

      let clickDetected = false;
      
      // Add temporary click listener
      const clickHandler = (e: Event) => {
        clickDetected = true;
        console.log('✅ Click detected on:', e.target);
        testButton.removeEventListener('click', clickHandler);
      };
      
      testButton.addEventListener('click', clickHandler, true);
      
      // Simulate click
      console.log('Simulating click on:', testButton);
      testButton.click();
      
      // Check result after brief delay
      setTimeout(() => {
        if (clickDetected) {
          console.log('✅ Interactive test PASSED - Clicks are working');
        } else {
          console.error('❌ Interactive test FAILED - Click not detected');
        }
        resolve(clickDetected);
      }, 100);
    });
  }

  // Fix any problematic elements found
  fixProblematicElements() {
    console.log('🔧 Fixing problematic elements...');
    
    const fixes = this.results.filter(r => !r.clickable && r.hasHandler);
    
    fixes.forEach(fix => {
      const elements = document.querySelectorAll(fix.selector);
      elements.forEach(el => {
        (el as HTMLElement).style.pointerEvents = 'auto';
        (el as HTMLElement).style.zIndex = '99999';
        (el as HTMLElement).style.position = 'relative';
      });
    });
    
    console.log(`🔧 Fixed ${fixes.length} problematic elements`);
  }
}

// Global test function
export const runSystemClickTest = async (): Promise<void> => {
  const tester = new SystemClickTester();
  
  // Run comprehensive test
  const results = tester.testAllInteractiveElements();
  
  // Run interactive test
  const interactiveResult = await tester.performInteractiveTest();
  
  // Fix any issues found
  tester.fixProblematicElements();
  
  // Final summary
  console.log('\n🎯 SYSTEM CLICK TEST COMPLETE');
  console.log(`Interactive test result: ${interactiveResult ? 'PASS ✅' : 'FAIL ❌'}`);
  
  return;
};