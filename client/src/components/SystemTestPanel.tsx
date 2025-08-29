import { useState, useEffect } from 'react';
import { runSystemClickTest } from '@/utils/systemClickTest';

/**
 * System Test Panel - Visual interface for testing clicks
 */
export const SystemTestPanel = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [testResults, setTestResults] = useState<string>('');

  const runTest = async () => {
    setTestStatus('running');
    setTestResults('Running comprehensive click test...\nCheck console for detailed results.');
    
    try {
      await runSystemClickTest();
      setTestResults('✅ System click test completed successfully!\nAll interactive elements should now be clickable.\nCheck browser console for detailed results.');
    } catch (error) {
      setTestResults(`❌ Test failed: ${error}\nCheck console for details.`);
    }
    
    setTestStatus('complete');
  };

  // Auto-run test on component mount
  useEffect(() => {
    setTimeout(runTest, 500);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        maxWidth: '300px',
        zIndex: 999999,
        fontFamily: 'monospace',
        fontSize: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        🔍 System Click Test Panel
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        Status: <span style={{ 
          color: testStatus === 'running' ? '#ffeb3b' : 
                testStatus === 'complete' ? '#4caf50' : '#fff'
        }}>
          {testStatus.toUpperCase()}
        </span>
      </div>
      
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '8px', 
        borderRadius: '5px',
        marginBottom: '10px',
        whiteSpace: 'pre-wrap',
        maxHeight: '100px',
        overflow: 'auto'
      }}>
        {testResults || 'Ready to test...'}
      </div>
      
      <button
        onClick={runTest}
        disabled={testStatus === 'running'}
        style={{
          background: testStatus === 'running' ? '#666' : '#4caf50',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '5px',
          cursor: testStatus === 'running' ? 'not-allowed' : 'pointer',
          fontSize: '11px',
          width: '100%'
        }}
      >
        {testStatus === 'running' ? 'Testing...' : 'Run Click Test'}
      </button>
      
      <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.8 }}>
        This panel tests all interactive elements and fixes any click issues found.
      </div>
    </div>
  );
};