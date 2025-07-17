#!/usr/bin/env python3
"""Test script to check YFinance availability"""

try:
    import yfinance as yf
    import pandas as pd
    print("✓ YFinance and pandas imported successfully")
    
    # Test basic functionality
    ticker = yf.Ticker("AAPL")
    info = ticker.info
    print(f"✓ Basic YFinance functionality works - AAPL company: {info.get('longName', 'Unknown')}")
    
    # Test news functionality
    news = ticker.news
    print(f"✓ News functionality works - Found {len(news)} news items")
    
except ImportError as e:
    print(f"✗ Import error: {e}")
except Exception as e:
    print(f"✗ Runtime error: {e}")
