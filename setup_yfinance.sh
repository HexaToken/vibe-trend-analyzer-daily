#!/bin/bash

echo "YFinance Setup Script"
echo "===================="

# Check if uv is available
if command -v uv &> /dev/null; then
    echo "✓ uv is available"
    echo "Installing dependencies with uv..."
    uv add yfinance pandas
    echo "Running uv sync to install dependencies..."
    uv sync
elif command -v pip &> /dev/null; then
    echo "✓ pip is available"
    echo "Installing dependencies with pip..."
    pip install yfinance pandas
else
    echo "✗ Neither uv nor pip is available"
    echo "Please install Python package manager first"
    exit 1
fi

# Test installation
echo ""
echo "Testing installation..."
python3 -c "
try:
    import yfinance as yf
    import pandas as pd
    print('✓ YFinance and pandas imported successfully')
    print(f'YFinance version: {yf.__version__}')
    print(f'Pandas version: {pd.__version__}')
    
    # Quick API test
    ticker = yf.Ticker('AAPL')
    info = ticker.info
    print(f'✓ API test successful: {info.get(\"longName\", \"Unknown\")}')
    
except ImportError as e:
    print(f'✗ Import error: {e}')
    print('Installation may have failed or packages not in Python path')
except Exception as e:
    print(f'✗ Runtime error: {e}')
    print('Packages imported but API test failed')
"

echo ""
echo "Setup complete! If successful, restart your development server to use YFinance features."
