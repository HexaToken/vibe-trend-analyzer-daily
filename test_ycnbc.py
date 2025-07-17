#!/usr/bin/env python3
"""
Test script for ycnbc package to understand its API and capabilities
"""

import sys
import os
sys.path.insert(0, '.pythonlibs/lib/python3.11/site-packages')

try:
    import ycnbc
    print("✓ Successfully imported ycnbc")
    print(f"ycnbc version: {getattr(ycnbc, '__version__', 'unknown')}")
    
    # Check available methods and classes
    print("\nAvailable methods and classes:")
    for attr in dir(ycnbc):
        if not attr.startswith('_'):
            print(f"  - {attr}: {type(getattr(ycnbc, attr))}")
    
    # Test basic functionality
    print("\n" + "="*50)
    print("TESTING YCNBC FUNCTIONALITY")
    print("="*50)
    
    # Try to get news data
    try:
        # Common stock symbols to test
        test_symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA']
        
        for symbol in test_symbols[:2]:  # Test first 2 symbols
            print(f"\nTesting news for {symbol}:")
            try:
                if hasattr(ycnbc, 'get_news'):
                    news = ycnbc.get_news(symbol)
                    print(f"  ✓ Got {len(news) if news else 0} news items")
                    if news and len(news) > 0:
                        print(f"  Sample headline: {news[0].get('title', 'No title')[:100]}...")
                elif hasattr(ycnbc, 'News'):
                    news_client = ycnbc.News()
                    news = news_client.get(symbol)
                    print(f"  ✓ Got {len(news) if news else 0} news items")
                elif hasattr(ycnbc, 'CNBC'):
                    cnbc = ycnbc.CNBC()
                    news = cnbc.get_news(symbol)
                    print(f"  ✓ Got {len(news) if news else 0} news items")
                else:
                    print(f"  ? Trying to explore available methods...")
                    # Try different common method names
                    for method_name in ['fetch_news', 'search', 'articles', 'headlines']:
                        if hasattr(ycnbc, method_name):
                            print(f"    Found method: {method_name}")
                            
            except Exception as e:
                print(f"  ✗ Error testing {symbol}: {str(e)}")
                
    except Exception as e:
        print(f"✗ Error in main test: {str(e)}")
        
    # Try to understand the structure better
    print(f"\n" + "="*50)
    print("EXPLORING YCNBC STRUCTURE")
    print("="*50)
    
    for attr_name in dir(ycnbc):
        if not attr_name.startswith('_'):
            attr = getattr(ycnbc, attr_name)
            print(f"\n{attr_name}:")
            print(f"  Type: {type(attr)}")
            if hasattr(attr, '__doc__') and attr.__doc__:
                print(f"  Doc: {attr.__doc__[:100]}...")
            if callable(attr):
                try:
                    import inspect
                    sig = inspect.signature(attr)
                    print(f"  Signature: {attr_name}{sig}")
                except:
                    print(f"  Callable: {attr_name}()")
                    
except ImportError as e:
    print(f"✗ Failed to import ycnbc: {e}")
    print("Checking installation...")
    import subprocess
    result = subprocess.run([sys.executable, '-m', 'pip', 'list'], capture_output=True, text=True)
    print("Installed packages:")
    print(result.stdout)
    
except Exception as e:
    print(f"✗ Unexpected error: {e}")
    import traceback
    traceback.print_exc()