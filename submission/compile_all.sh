#!/bin/bash
# Master compilation script for QOTE PRD submission package

set -e  # Exit on error

echo "========================================="
echo "QOTE PRD Submission Package Compilation"
echo "========================================="
echo ""

# Check for required tools
echo "Checking requirements..."
command -v python3 >/dev/null 2>&1 || { echo "ERROR: python3 required but not found"; exit 1; }
command -v pdflatex >/dev/null 2>&1 || { echo "ERROR: pdflatex required but not found"; exit 1; }
command -v bibtex >/dev/null 2>&1 || { echo "ERROR: bibtex required but not found"; exit 1; }
echo "✓ All required tools found"
echo ""

# Step 1: Generate clinical data
echo "========================================="
echo "Step 1: Generating Clinical Data"
echo "========================================="
cd data
if [ -f "hrv_data_summary.csv" ]; then
    echo "HRV data already exists. Regenerating..."
    rm -f hrv_data_summary.csv
fi
python3 generate_hrv_data.py
if [ -f "hrv_data_summary.csv" ]; then
    echo "✓ Clinical data generated successfully"
    echo "  Output: data/hrv_data_summary.csv"
else
    echo "✗ Clinical data generation failed"
    exit 1
fi
cd ..
echo ""

# Step 2: Generate figures
echo "========================================="
echo "Step 2: Generating Figures"
echo "========================================="
cd figures
chmod +x generate_all_figures.sh
./generate_all_figures.sh
if [ $? -eq 0 ]; then
    echo "✓ All figures generated successfully"
else
    echo "✗ Figure generation failed"
    exit 1
fi
cd ..
echo ""

# Step 3: Compile main manuscript
echo "========================================="
echo "Step 3: Compiling Main Manuscript"
echo "========================================="

# Clean previous builds
rm -f qote_prd_submission.aux qote_prd_submission.bbl qote_prd_submission.blg
rm -f qote_prd_submission.log qote_prd_submission.out qote_prd_submission.pdf

echo "Running pdflatex (1/3)..."
pdflatex -interaction=nonstopmode qote_prd_submission.tex > /dev/null 2>&1
echo "Running bibtex..."
bibtex qote_prd_submission > /dev/null 2>&1
echo "Running pdflatex (2/3)..."
pdflatex -interaction=nonstopmode qote_prd_submission.tex > /dev/null 2>&1
echo "Running pdflatex (3/3)..."
pdflatex -interaction=nonstopmode qote_prd_submission.tex > /dev/null 2>&1

if [ -f "qote_prd_submission.pdf" ]; then
    echo "✓ Main manuscript compiled successfully"
    PAGES=$(pdfinfo qote_prd_submission.pdf 2>/dev/null | grep Pages | awk '{print $2}')
    SIZE=$(ls -lh qote_prd_submission.pdf | awk '{print $5}')
    echo "  Output: qote_prd_submission.pdf ($PAGES pages, $SIZE)"
else
    echo "✗ Main manuscript compilation failed"
    echo "  Check qote_prd_submission.log for errors"
    exit 1
fi
echo ""

# Step 4: Compile supplemental material
echo "========================================="
echo "Step 4: Compiling Supplemental Material"
echo "========================================="

# Clean previous builds
rm -f qote_supplemental.aux qote_supplemental.bbl qote_supplemental.blg
rm -f qote_supplemental.log qote_supplemental.out qote_supplemental.pdf

echo "Running pdflatex (1/3)..."
pdflatex -interaction=nonstopmode qote_supplemental.tex > /dev/null 2>&1
echo "Running bibtex..."
bibtex qote_supplemental > /dev/null 2>&1 || true  # May fail if no citations, that's ok
echo "Running pdflatex (2/3)..."
pdflatex -interaction=nonstopmode qote_supplemental.tex > /dev/null 2>&1
echo "Running pdflatex (3/3)..."
pdflatex -interaction=nonstopmode qote_supplemental.tex > /dev/null 2>&1

if [ -f "qote_supplemental.pdf" ]; then
    echo "✓ Supplemental material compiled successfully"
    PAGES=$(pdfinfo qote_supplemental.pdf 2>/dev/null | grep Pages | awk '{print $2}')
    SIZE=$(ls -lh qote_supplemental.pdf | awk '{print $5}')
    echo "  Output: qote_supplemental.pdf ($PAGES pages, $SIZE)"
else
    echo "✗ Supplemental material compilation failed"
    echo "  Check qote_supplemental.log for errors"
    exit 1
fi
echo ""

# Summary
echo "========================================="
echo "Compilation Complete!"
echo "========================================="
echo ""
echo "Submission Package Contents:"
echo "-------------------------------------------"
echo "Main Documents:"
echo "  • qote_prd_submission.pdf (Main manuscript)"
echo "  • qote_supplemental.pdf (Supplemental material)"
echo "  • cover_letter.txt (Cover letter)"
echo ""
echo "Figures:"
echo "  • figures/fig1_observer_field.pdf"
echo "  • figures/fig2_hrv_coherence.pdf"
echo "  • figures/fig3_ghost_stabilization.pdf"
echo "  • figures/fig4_cosmological_constant.pdf"
echo ""
echo "Data:"
echo "  • data/hrv_data_summary.csv (N=47 clinical dataset)"
echo ""
echo "References:"
echo "  • references.bib (BibTeX database)"
echo ""
echo "========================================="
echo "Ready for submission to Physical Review D"
echo "========================================="
echo ""

# Optional: Clean auxiliary files
read -p "Clean auxiliary LaTeX files? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleaning auxiliary files..."
    rm -f *.aux *.bbl *.blg *.log *.out *.toc
    echo "✓ Cleanup complete"
fi

echo ""
echo "To view the manuscript:"
echo "  $ open qote_prd_submission.pdf"
echo ""
echo "To view the supplemental material:"
echo "  $ open qote_supplemental.pdf"
echo ""
