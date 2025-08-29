import { useState } from 'react';

/**
 * Emergency click test component to verify clicks are working
 */
export const ClickTestButton = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    console.log('ClickTestButton clicked:', clickCount + 1);
    alert(`Button clicked ${clickCount + 1} times!`);
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        zIndex: 99999,
        background: 'red',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
      onClick={handleClick}
    >
      CLICK TEST ({clickCount})
    </div>
  );
};