# TORD Governance Panels

**Biological Governance Through Chromatin Topology**

Formal model bridging physics (oscillator theory), biology (chromatin topology), and medicine (precision interventions).

---

## Overview

The **TORD (Topological Oscillator with Repair Delay)** framework formalizes biological governance as chromatin topology dynamics. This repository contains production-ready implementations, governance panel visualizations, and clinical translation materials.

### Core Innovation

**Biology is topology-first, not mutation-first.** Chromatin architecture governs mutation risk, memory persistence, stress resilience, and aging—quantifiable through measurable observables.

---

## Deliverables

### 1. **TORD Core Models**

- **`models/tord_core.py`**: Reference Python implementation with delay differential equations
- **`models/tord_jax.py`**: Production JAX version (GPU-accelerated, autodiff for optimization)

**State variables:**
- `x(t)`: Chromatin accessibility (ATAC-seq, DNase-seq)
- `y(t)`: Repair system activity (γH2AX, 53BP1 foci)
- `Θ(t)`: Topological boundary strength (Hi-C insulation score)
- `u(t)`: Environmental perturbation (stress, UV, hormones)
- `η`: Repair delay (context-dependent: 20min–4hr)

### 2. **Governance Panels** (PDF visualizations)

#### **Engram Memory Panel** (`panels/engram_memory_panel.py`)
- **Biology:** Persistent chromatin loops at learning genes (Chen et al. *Nature Neurosci* 2024)
- **Clinical:** Memory consolidation, PTSD reconsolidation, learning optimization
- **Key parameters:** High κ (strong reinforcement), low λ (weeks-long persistence)

#### **HPA Stress Panel** (`panels/hpa_stress_panel.py`)
- **Biology:** Glucocorticoid receptor dynamics, FKBP5 feedback loop
- **Clinical:** HRV biofeedback, burnout prevention, dissociative episode reduction
- **Key parameters:** High μ (stress coupling), moderate λ (boundary erosion)

#### **Development Boundary Panel** (`panels/development_boundary_panel.py`)
- **Biology:** Mechanotransduction, TAD boundary formation
- **Clinical:** Developmental origins of disease (DOHaD), tissue engineering
- **Key parameters:** Very high κ (strong formation), ultra-low λ (permanent boundaries)

### 3. **Clinical Materials**

- **`clinical/clinical_translation_2pager.tex`**: 2-page LaTeX document
  - **Page 1:** TORD framework, six-layer evidence stack, biological scenarios
  - **Page 2:** Risk/Resilience/Recovery framework, clinical workflows, therapeutic targets

- **`figures/substrate_map_master.tex`**: TikZ master figure
  - Annotated chromatin topology map showing:
    - UV triage hotspots (NER priority at accessible sites)
    - ART drift trajectories (early↔late replication timing)
    - PMD depth encoding (mitotic clock)
    - Engram loops (persistent topology islands)
    - Stress perturbation vectors
    - Repair delay η propagation

---

## Installation

```bash
# Clone repository
git clone <repo-url>
cd governance-panels

# Install dependencies
pip install -r requirements.txt

# For JAX with GPU support (optional):
pip install --upgrade "jax[cuda12_pip]" -f https://storage.googleapis.com/jax-releases/jax_cuda_releases.html
```

**System requirements:**
- Python 3.9+
- For LaTeX compilation: `pdflatex` (TeX Live or MikTeX)
- For JAX GPU: CUDA 12.x (optional, CPU version works)

---

## Usage

### Quick Start: Generate All Panels

```bash
cd governance-panels
python run_all_panels.py
```

**Outputs** (saved to `outputs/`):
- `engram_memory_panel.pdf`
- `hpa_stress_panel.pdf`
- `development_boundary_panel.pdf`
- `clinical_translation_2pager.pdf`
- `substrate_map_master.pdf`
- CSV trajectory files for all scenarios

### Individual Panel Generation

```python
from panels.engram_memory_panel import create_engram_panel

# Generate engram panel
fig, (t, states) = create_engram_panel("my_engram_panel.pdf")
```

### Core Model Usage

```python
from models.tord_core import TORDModel, get_engram_params

# Initialize model
params = get_engram_params()
model = TORDModel(params)

# Simulate
t, states = model.simulate(
    t_span=(0, 240),  # 10 days
    n_points=5000,
    u_pattern="recall"  # Memory recall protocol
)

# Extract state variables
x = states[:, 0]  # Accessibility
y = states[:, 2]  # Repair activity
theta = states[:, 4]  # Boundary strength

# Save trajectory
model.save_trajectory("trajectory.csv", t, states)
```

### JAX Production Model (parameter sweeps, optimization)

```python
from models.tord_jax import TORDModelJAX, TORDParamsJAX
import jax.numpy as jnp

# Initialize
params = TORDParamsJAX(kappa=0.15, lambda_=0.01)  # Engram parameters
model = TORDModelJAX(params)

# Parameter sweep (vectorized)
alpha_range = jnp.linspace(0.1, 0.6, 20)
results = model.parameter_sweep(
    param_name='alpha',
    param_range=alpha_range,
    t_span=(0, 100),
    u_pattern="pulse"
)

# results['states_ensemble'] shape: (20, n_points, 5)
# Analyze ensemble trajectories...
```

---

## Biological Grounding: Six-Layer Evidence Stack

1. **Chromatin topology → mutation hotspots**
   RT/CA predict mutation patterns genome-wide (Stamatoyannopoulos et al. *Nature* 2009; PCAWG *Nature* 2020)

2. **Cancer/aging are topology-first**
   Altered replication timing (ART) precedes mutations; PMDs track mitotic age (Ryba et al. *Genome Res* 2011; Zhou et al. *Nat Genet* 2018)

3. **Identity encoded as attractor**
   Persistent loops in engram neurons last weeks (Chen et al. *Nature Neurosci* 2024)

4. **UV governance reveal**
   NER prioritizes accessible sites, not damage density (Adar et al. *Genome Res* 2016)

5. **Oscillator mapping**
   Every TORD parameter maps to biological observable (ω_x = circadian, η = NER delay, κ = HDAC/HAT, λ = inflammation)

6. **Structure from floor**
   Boundary sharpening via coherence gating (SLFN5), reinscription (53BP1) (Chiolo et al. *Cell* 2011)

---

## Clinical Applications

### **Memory & Learning**
- **Protocol:** Optimize recall timing (TORD predicts 10, 20, 30hr intervals)
- **Targets:** HDAC inhibitors (increase κ), activity-based training
- **Outcomes:** Enhanced consolidation, PTSD symptom reduction

### **HPA Stress & Burnout**
- **Monitoring:** Track Θ via HRV coherence, inflammatory markers (IL-6)
- **Intervention:** Vagal tone training (↑κ), anti-inflammatory diet (↓λ)
- **Outcomes:** Reduced dissociative episodes, improved recovery time

### **Cancer Risk Stratification**
- **Biomarker:** ART signature in liquid biopsy (cfDNA RT profiling)
- **Risk metric:** Boundary instability (low Θ, high λ)
- **Intervention:** Boundary stabilizers, inflammation control

### **Developmental Origins of Disease**
- **Model:** Mechanotransduction → fate commitment via Θ establishment
- **Timing:** Early intervention (before commitment threshold)
- **Targets:** ECM stiffness modulation, CTCF/cohesin stabilizers

---

## Repository Structure

```
governance-panels/
├── models/
│   ├── tord_core.py          # Python reference implementation
│   └── tord_jax.py            # JAX production version
├── panels/
│   ├── engram_memory_panel.py
│   ├── hpa_stress_panel.py
│   └── development_boundary_panel.py
├── clinical/
│   └── clinical_translation_2pager.tex
├── figures/
│   └── substrate_map_master.tex
├── run_all_panels.py          # Master generation script
├── requirements.txt
└── README.md
```

---

## Testing

```bash
# Install test dependencies
pip install pytest pytest-cov

# Run tests (when test suite is added)
pytest tests/ -v --cov=models
```

---

## Next Steps

1. **RT/CA data integration:** Fit TORD to CA2M repository mutation data
2. **Clinical validation:** HRV trial for Θ tracking in stress cohort
3. **Liquid biopsy pilot:** Longitudinal ART signature measurement
4. **Parameter optimization:** Use JAX autodiff to fit clinical datasets
5. **Interactive dashboard:** Web interface for real-time parameter exploration

---

## Citation

If you use TORD in your research, please cite:

```
Kayser, M. (2025). TORD: Topological Oscillator with Repair Delay -
A Formal Framework for Biological Governance. GitHub repository.
```

---

## Author

**Michael Kayser**
2025-12-27

Formal bridge between physics (oscillator theory), biology (chromatin topology), and medicine (precision interventions).

---

## License

MIT License (add LICENSE file as needed)

---

## Contact

For questions, collaborations, or clinical validation studies, please open an issue or contact via GitHub.
