#!/usr/bin/env python3
"""
Detailed test of ycnbc News and Markets functionality
"""

import sys
sys.path.insert(0, '.pythonlibs/lib/python3.11/site-packages')

try:
    import ycnbc
    from pprint import pprint
    
    print("="*60)
    print("TESTING YCNBC NEWS CLASS")
    print("="*60)
    
    # Test News class
    news = ycnbc.News()
    print(f"News object created: {type(news)}")
    
    # Test available methods
    print("\nTesting news.latest():")
    try:
        latest_news = news.latest()
        print(f"Type: {type(latest_news)}")
        if isinstance(latest_news, dict):
            print(f"Keys: {list(latest_news.keys())}")
            if 'data' in latest_news:
                data = latest_news['data']
                print(f"Data type: {type(data)}")
                if isinstance(data, list) and len(data) > 0:
                    print(f"Number of articles: {len(data)}")
                    print("First article sample:")
                    pprint(data[0] if len(data) > 0 else "No articles")
        else:
            print("Content:")
            pprint(latest_news)
    except Exception as e:
        print(f"Error getting latest news: {e}")
    
    print("\nTesting news.trending():")
    try:
        trending_news = news.trending()
        print(f"Type: {type(trending_news)}")
        if isinstance(trending_news, dict):
            print(f"Keys: {list(trending_news.keys())}")
            if 'data' in trending_news:
                data = trending_news['data']
                print(f"Data type: {type(data)}")
                if isinstance(data, list) and len(data) > 0:
                    print(f"Number of trending articles: {len(data)}")
                    print("First trending article sample:")
                    pprint(data[0] if len(data) > 0 else "No articles")
        else:
            print("Content:")
            pprint(trending_news)
    except Exception as e:
        print(f"Error getting trending news: {e}")
    
    print("\n" + "="*60)
    print("TESTING YCNBC MARKETS CLASS")
    print("="*60)
    
    # Test Markets class
    markets = ycnbc.Markets()
    print(f"Markets object created: {type(markets)}")
    
    # Test quote_summary for stock symbols
    test_symbols = ['AAPL', 'MSFT', 'GOOGL']
    
    for symbol in test_symbols:
        print(f"\nTesting markets.quote_summary('{symbol}'):")
        try:
            quote = markets.quote_summary(symbol)
            print(f"Type: {type(quote)}")
            if quote:
                print(f"Keys: {list(quote.keys()) if isinstance(quote, dict) else 'Not a dict'}")
                if isinstance(quote, dict):
                    # Show key financial data
                    for key in ['symbol', 'name', 'price', 'change', 'changePercent']:
                        if key in quote:
                            print(f"  {key}: {quote[key]}")
            else:
                print("  No data returned")
        except Exception as e:
            print(f"  Error getting quote for {symbol}: {e}")
    
    # Test market data methods
    market_methods = [
        ('us_markets', 'US Markets'),
        ('pre_markets', 'Pre Markets'),
        ('cryptocurrencies', 'Cryptocurrencies'),
        ('bonds', 'Bonds')
    ]
    
    for method_name, description in market_methods:
        print(f"\nTesting markets.{method_name}():")
        try:
            data = getattr(markets, method_name)()
            print(f"  Type: {type(data)}")
            if isinstance(data, list):
                print(f"  Number of items: {len(data)}")
                if len(data) > 0:
                    print(f"  Sample item keys: {list(data[0].keys()) if isinstance(data[0], dict) else 'Not a dict'}")
            elif data:
                print(f"  Keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
            else:
                print("  No data returned")
        except Exception as e:
            print(f"  Error getting {description}: {e}")
            
except ImportError as e:
    print(f"Failed to import ycnbc: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
    import traceback
    traceback.print_exc()