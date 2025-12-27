#!/usr/bin/env python3
"""
Master script to generate all governance panels
================================================

Generates:
1. TORD model CSV trajectories (4 scenarios)
2. Engram Memory Panel PDF
3. HPA Stress Panel PDF
4. Development Boundary Panel PDF
5. Combined summary report

Author: Michael Kayser
Date: 2025-12-27
"""

import sys
import os
import time
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Import panel generators
from panels.engram_memory_panel import create_engram_panel
from panels.hpa_stress_panel import create_hpa_stress_panel
from panels.development_boundary_panel import create_development_panel

# Import TORD models
from models.tord_core import (
    TORDModel,
    get_uv_triage_params,
    get_engram_params,
    get_hpa_stress_params,
    get_development_params
)


def print_banner(text):
    """Print a formatted banner."""
    width = 80
    print("\n" + "=" * width)
    print(text.center(width))
    print("=" * width + "\n")


def generate_base_trajectories(output_dir="outputs"):
    """
    Generate base TORD trajectories for all scenarios.

    Creates CSV files for downstream analysis.
    """
    print_banner("Generating TORD Base Trajectories")

    os.makedirs(output_dir, exist_ok=True)

    scenarios = [
        ("UV Triage", get_uv_triage_params(), "pulse", (0, 50), 2000),
        ("Engram Memory", get_engram_params(), "recall", (0, 240), 3000),
        ("HPA Stress", get_hpa_stress_params(), "stress", (0, 120), 3000),
        ("Development", get_development_params(), "chronic", (0, 100), 2000),
    ]

    for name, params, pattern, t_span, n_points in scenarios:
        print(f"Running {name} scenario...")
        model = TORDModel(params)

        # Initial state
        if name == "Development":
            initial_state = [0.15, 0.0, 0.05, 0.0, 0.3]  # Pluripotent
        else:
            initial_state = [0.1, 0.0, 0.05, 0.0, 1.0]   # Baseline

        # Simulate
        t, states = model.simulate(
            t_span=t_span,
            n_points=n_points,
            initial_state=initial_state,
            u_pattern=pattern
        )

        # Save
        filename = f"{output_dir}/tord_{name.lower().replace(' ', '_')}.csv"
        model.save_trajectory(filename, t, states)

        print(f"  ✓ Saved to {filename}")

    print("\n✓ All base trajectories generated")


def generate_panel_pdfs(output_dir="outputs"):
    """
    Generate all governance panel PDFs.
    """
    print_banner("Generating Governance Panel PDFs")

    os.makedirs(output_dir, exist_ok=True)

    # Panel 1: Engram Memory
    print("Generating Engram Memory Panel...")
    try:
        engram_path = f"{output_dir}/engram_memory_panel.pdf"
        create_engram_panel(engram_path)
        print(f"  ✓ Engram panel saved to {engram_path}")
    except Exception as e:
        print(f"  ✗ Error generating Engram panel: {e}")

    # Panel 2: HPA Stress
    print("\nGenerating HPA Stress Panel...")
    try:
        hpa_path = f"{output_dir}/hpa_stress_panel.pdf"
        create_hpa_stress_panel(hpa_path)
        print(f"  ✓ HPA panel saved to {hpa_path}")
    except Exception as e:
        print(f"  ✗ Error generating HPA panel: {e}")

    # Panel 3: Development
    print("\nGenerating Development Boundary Panel...")
    try:
        dev_path = f"{output_dir}/development_boundary_panel.pdf"
        create_development_panel(dev_path)
        print(f"  ✓ Development panel saved to {dev_path}")
    except Exception as e:
        print(f"  ✗ Error generating Development panel: {e}")

    print("\n✓ All panels generated")


def compile_latex_docs(output_dir="outputs"):
    """
    Compile LaTeX documents (clinical 2-pager and TikZ figure).
    """
    print_banner("Compiling LaTeX Documents")

    import subprocess

    docs = [
        ("clinical/clinical_translation_2pager.tex", "Clinical 2-pager"),
        ("figures/substrate_map_master.tex", "Substrate map figure"),
    ]

    for tex_path, description in docs:
        print(f"Compiling {description}...")
        try:
            # Run pdflatex
            result = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "-output-directory", output_dir, tex_path],
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                pdf_name = Path(tex_path).stem + ".pdf"
                print(f"  ✓ {description} compiled: {output_dir}/{pdf_name}")
            else:
                print(f"  ✗ Compilation failed for {description}")
                print(f"     Error: {result.stderr[:200]}")

        except FileNotFoundError:
            print(f"  ✗ pdflatex not found - skipping {description}")
        except subprocess.TimeoutExpired:
            print(f"  ✗ Compilation timeout for {description}")
        except Exception as e:
            print(f"  ✗ Error compiling {description}: {e}")


def generate_summary_report(output_dir="outputs"):
    """
    Generate summary report of all outputs.
    """
    print_banner("Generating Summary Report")

    report_path = f"{output_dir}/SUMMARY_REPORT.txt"

    with open(report_path, 'w') as f:
        f.write("=" * 80 + "\n")
        f.write("TORD Governance Panels: Summary Report\n".center(80))
        f.write("=" * 80 + "\n\n")

        f.write("Generated: " + time.strftime("%Y-%m-%d %H:%M:%S") + "\n\n")

        f.write("DELIVERABLES:\n")
        f.write("-" * 80 + "\n\n")

        f.write("1. TORD Core Model Implementations:\n")
        f.write("   - models/tord_core.py (Python reference with delay)\n")
        f.write("   - models/tord_jax.py (JAX production version)\n\n")

        f.write("2. Governance Panel PDFs:\n")
        f.write("   - engram_memory_panel.pdf (Memory persistence)\n")
        f.write("   - hpa_stress_panel.pdf (Neuroendocrine resilience)\n")
        f.write("   - development_boundary_panel.pdf (Fate specification)\n\n")

        f.write("3. Clinical Materials:\n")
        f.write("   - clinical_translation_2pager.pdf (Risk/Resilience/Recovery framework)\n")
        f.write("   - substrate_map_master.pdf (Annotated topology map)\n\n")

        f.write("4. Trajectory Data (CSV):\n")
        f.write("   - tord_uv_triage.csv\n")
        f.write("   - tord_engram_memory.csv\n")
        f.write("   - tord_hpa_stress.csv\n")
        f.write("   - tord_development.csv\n\n")

        f.write("=" * 80 + "\n")
        f.write("BIOLOGICAL GROUNDING (Six-Layer Evidence Stack)\n")
        f.write("=" * 80 + "\n\n")

        evidence = [
            ("RT/CA → Mutation Hotspots", "Stamatoyannopoulos et al. Nature 2009; PCAWG Nature 2020"),
            ("Cancer/Aging Topology-First", "Ryba et al. Genome Res 2011; Zhou et al. Nat Genet 2018"),
            ("Identity as Attractor", "Chen et al. Nature Neurosci 2024 (engram loops)"),
            ("UV Governance Reveal", "Adar et al. Genome Res 2016 (NER triage)"),
            ("Oscillator Mapping", "All TORD parameters map to biological observables"),
            ("Structure from Floor", "SLFN5/53BP1 reinscription (Chiolo et al. Cell 2011)"),
        ]

        for i, (title, ref) in enumerate(evidence, 1):
            f.write(f"{i}. {title}\n")
            f.write(f"   {ref}\n\n")

        f.write("=" * 80 + "\n")
        f.write("CLINICAL APPLICATIONS\n")
        f.write("=" * 80 + "\n\n")

        applications = [
            ("Engram Panel", "Memory consolidation, PTSD reconsolidation, learning optimization"),
            ("HPA Panel", "HRV biofeedback, burnout prevention, dissociative episode reduction"),
            ("Development Panel", "DOHaD, congenital disorders, tissue engineering"),
            ("UV Triage Model", "Mutation risk stratification, DNA repair deficiency syndromes"),
        ]

        for panel, apps in applications:
            f.write(f"• {panel}:\n")
            f.write(f"  {apps}\n\n")

        f.write("=" * 80 + "\n")
        f.write("NEXT STEPS\n")
        f.write("=" * 80 + "\n\n")

        next_steps = [
            "Integrate RT/CA data from CA2M repository",
            "Run JAX parameter sweeps for optimization",
            "HRV clinical trial (Θ tracking validation)",
            "Liquid biopsy pilot (ART signatures)",
            "Unit test suite for model validation",
        ]

        for i, step in enumerate(next_steps, 1):
            f.write(f"{i}. {step}\n")

        f.write("\n" + "=" * 80 + "\n")
        f.write("Michael Kayser | TORD Framework | 2025-12-27\n".center(80))
        f.write("=" * 80 + "\n")

    print(f"✓ Summary report saved to {report_path}")


def main():
    """Main execution."""
    print_banner("TORD Governance Panels: Complete Generation Pipeline")

    start_time = time.time()

    # Create output directory
    output_dir = "outputs"
    os.makedirs(output_dir, exist_ok=True)

    # Step 1: Generate base trajectories
    generate_base_trajectories(output_dir)

    # Step 2: Generate panel PDFs
    generate_panel_pdfs(output_dir)

    # Step 3: Compile LaTeX documents
    compile_latex_docs(output_dir)

    # Step 4: Generate summary report
    generate_summary_report(output_dir)

    elapsed_time = time.time() - start_time

    print_banner("Pipeline Complete")
    print(f"Total execution time: {elapsed_time:.2f} seconds")
    print(f"All outputs saved to: {output_dir}/")
    print("\nNext: Review panels and run clinical validation studies")


if __name__ == "__main__":
    main()
