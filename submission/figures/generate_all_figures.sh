#!/bin/bash
# Generate all figures for QOTE PRD submission

echo "========================================="
echo "Generating QOTE Submission Figures"
echo "========================================="
echo ""

# Check for Python3
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 not found. Please install Python 3.7+"
    exit 1
fi

# Check for required packages
python3 -c "import numpy, scipy, matplotlib" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "ERROR: Required Python packages not found."
    echo "Please run: pip install numpy scipy matplotlib"
    exit 1
fi

echo "Step 1/4: Generating Figure 1 (Observer Field Dynamics)..."
python3 generate_fig1_observer_field.py
if [ $? -eq 0 ]; then
    echo "✓ Figure 1 generated successfully"
else
    echo "✗ Figure 1 generation failed"
    exit 1
fi
echo ""

echo "Step 2/4: Generating Figure 2 (HRV Coherence Data)..."
python3 generate_fig2_hrv_coherence.py
if [ $? -eq 0 ]; then
    echo "✓ Figure 2 generated successfully"
else
    echo "✗ Figure 2 generation failed"
    exit 1
fi
echo ""

echo "Step 3/4: Generating Figure 3 (Ghost Stabilization)..."
python3 generate_fig3_ghost_stabilization.py
if [ $? -eq 0 ]; then
    echo "✓ Figure 3 generated successfully"
else
    echo "✗ Figure 3 generation failed"
    exit 1
fi
echo ""

echo "Step 4/4: Generating Figure 4 (Cosmological Constant)..."
python3 generate_fig4_cosmological_constant.py
if [ $? -eq 0 ]; then
    echo "✓ Figure 4 generated successfully"
else
    echo "✗ Figure 4 generation failed"
    exit 1
fi
echo ""

echo "========================================="
echo "All figures generated successfully!"
echo "========================================="
echo ""
echo "Output files:"
ls -lh fig*.pdf 2>/dev/null || echo "No PDF files found (check for errors above)"
