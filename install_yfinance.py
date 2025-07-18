#!/usr/bin/env python3
"""
Script to help install YFinance and pandas dependencies
"""

import sys
import subprocess
import importlib.util

def check_package(package_name):
    """Check if a package is installed"""
    spec = importlib.util.find_spec(package_name)
    return spec is not None

def install_package(package_name):
    """Try to install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    print("YFinance Dependency Installation Helper")
    print("=" * 40)
    
    # Check current status
    yfinance_available = check_package("yfinance")
    pandas_available = check_package("pandas")
    
    print(f"Current status:")
    print(f"  yfinance: {'✓ Available' if yfinance_available else '✗ Not found'}")
    print(f"  pandas: {'✓ Available' if pandas_available else '✗ Not found'}")
    print()
    
    if yfinance_available and pandas_available:
        print("✓ All dependencies are already installed!")
        
        # Test functionality
        try:
            import yfinance as yf
            import pandas as pd
            print(f"✓ YFinance version: {yf.__version__}")
            print(f"✓ Pandas version: {pd.__version__}")
            
            # Quick test
            ticker = yf.Ticker("AAPL")
            info = ticker.info
            print(f"✓ API test successful: {info.get('longName', 'Unknown')}")
            
        except Exception as e:
            print(f"✗ Error testing functionality: {e}")
        
        return
    
    print("Missing dependencies detected. Installation options:")
    print()
    print("Option 1 - Using uv (recommended if available):")
    print("  uv add yfinance pandas")
    print()
    print("Option 2 - Using pip:")
    print("  pip install yfinance pandas")
    print()
    print("Option 3 - Using pip with user directory:")
    print("  pip install --user yfinance pandas")
    print()
    
    # Try automatic installation
    try_auto = input("Try automatic installation with pip? (y/N): ").lower().strip()
    if try_auto == 'y':
        print("\nAttempting automatic installation...")
        
        packages_to_install = []
        if not yfinance_available:
            packages_to_install.append("yfinance")
        if not pandas_available:
            packages_to_install.append("pandas")
        
        for package in packages_to_install:
            print(f"Installing {package}...")
            if install_package(package):
                print(f"✓ {package} installed successfully")
            else:
                print(f"✗ Failed to install {package}")
        
        # Re-check
        print("\nRechecking installation...")
        yfinance_available = check_package("yfinance")
        pandas_available = check_package("pandas")
        
        if yfinance_available and pandas_available:
            print("✓ Installation successful!")
        else:
            print("✗ Installation incomplete. Please try manual installation.")

if __name__ == "__main__":
    main()
