# CLAUDE.md - AI Assistant Development Guide

> **Last Updated**: 2025-12-29
> **Repository**: QOTE × AlphaEvolve × Resona Convergence Framework

---

## Overview

This repository is a **monorepo** containing the QOTE (Quantum Observer Temporal Encoding) framework—a convergence system for AI-accelerated mathematical discovery that respects biological coherence patterns. It combines Next.js web applications, Python scientific computing, and comprehensive documentation into a unified deployment package.

### Core Thesis

Mathematical discovery is not just symbolic manipulation—it's a living process that mirrors biological regulation. When AI systems discover new mathematics, they should oscillate, cohere, and resonate like living systems do.

---

## Repository Structure

```
QOTE-Deploy-Pro/
├── qote-app/                    # Main Next.js application (port 3000)
├── coherence-sentinel/          # Clinical monitoring dashboard (port 3001)
├── governance-panels/           # Python scientific computing package
├── qote-spiral-site/           # Standalone static site
├── docs/                        # Framework documentation (txt files)
├── technical/                   # Technical specifications
├── submission/                  # Academic paper submission package
├── visualizations/              # Interactive HTML demos
├── index.html, script.js        # Root-level glyph decoder tool
└── vercel.json                  # Main deployment configuration
```

### Directory Relationships

- **qote-app**: Main public-facing application showcasing QOTE framework
- **coherence-sentinel**: Standalone clinical monitoring dashboard with dual "myth layer" UI
- **governance-panels**: Python package for TORD (Topological Oscillator with Repair Delay) biological simulations
- **docs/**: Master documentation consumed by qote-app's docs browser
- **submission/**: Complete LaTeX academic paper with reproducible figures
- **visualizations/**: Self-contained HTML demos (no build process)

---

## Technology Stack

### Frontend (qote-app & coherence-sentinel)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.1 | React framework with App Router |
| **React** | 19.2.0 | UI library with Server Components |
| **TypeScript** | 5.9.3 | Type safety and IDE support |
| **Tailwind CSS** | 4.1.17 | Utility-first styling |
| **Radix UI** | Latest | Accessible component primitives |
| **Lucide React** | 0.561.0 | Icon library |
| **Recharts** | 3.6.0 | Data visualization |

**Key Patterns:**
- **App Router** file-based routing (Next.js 13+)
- **Server Components** by default, Client Components marked with `'use client'`
- **shadcn/ui** pattern for UI components in `components/ui/`
- **React Context API** for state management (no Redux/Zustand)
- **HSL color system** via CSS custom properties

### Backend/Scientific Computing (governance-panels)

| Technology | Purpose |
|------------|---------|
| **Python 3.9+** | Runtime |
| **NumPy** | Numerical computing |
| **SciPy** | Scientific algorithms |
| **JAX** | GPU-accelerated autodiff |
| **Matplotlib** | Visualization |
| **Pandas** | Data handling |

### Deployment

- **Vercel**: Primary deployment platform (serverless)
- **Node.js 18+**: Runtime environment
- **Standalone output mode**: Self-contained deployments

---

## Development Workflows

### Quick Start

```bash
# Main application (qote-app)
cd qote-app
npm install
npm run dev          # http://localhost:3000

# Clinical dashboard (coherence-sentinel)
cd coherence-sentinel
npm install
npm run dev          # http://localhost:3001

# Python scientific computing
cd governance-panels
pip install -r requirements.txt
python run_all_panels.py
```

### Common Commands

#### qote-app
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # Run ESLint
```

#### coherence-sentinel
```bash
npm run dev          # Start dev server on port 3001
npm run build        # Production build
npm run start        # Serve production on port 3001
npm run lint         # Run ESLint
```

#### governance-panels
```bash
python run_all_panels.py                    # Generate all PDF panels
python panels/engram_memory_panel.py        # Individual panel
python models/tord_jax.py                   # Run JAX model
pytest tests/                               # Run tests
```

### Build Process

**Development:**
1. Next.js dev server runs with Fast Refresh
2. TypeScript compilation on-the-fly
3. Tailwind JIT compilation
4. Hot module replacement enabled

**Production:**
1. TypeScript compilation with strict mode
2. Tailwind CSS purging (content scanning)
3. Next.js optimization (code splitting, image optimization)
4. Static page pre-rendering where possible
5. Output to `.next/` directory

**Vercel Deployment:**
```json
// Root vercel.json
{
  "buildCommand": "cd qote-app && npm run build",
  "installCommand": "cd qote-app && npm install",
  "outputDirectory": "qote-app/.next"
}
```

---

## Key Conventions for AI Assistants

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| React Components | `PascalCase.tsx` | `ArchitectureDiagram.tsx` |
| Utilities/Logic | `kebab-case.ts` | `myth-labels.ts` |
| Pages | `page.tsx` | `app/docs/page.tsx` |
| Layouts | `layout.tsx` | `app/layout.tsx` |
| Types | `types.ts` | `lib/types.ts` |
| Python files | `snake_case.py` | `tord_core.py` |

### Code Organization

**Next.js App Structure:**
```
app/
├── page.tsx              # Route component
├── layout.tsx            # Persistent UI wrapper
├── globals.css           # Global styles
└── [route]/
    └── page.tsx          # Nested route
```

**Component Organization:**
```
components/
├── ui/                   # Base primitives (shadcn/ui)
│   ├── card.tsx
│   ├── badge.tsx
│   └── button.tsx
└── FeatureComponent.tsx  # Feature-specific components
```

**Library Organization:**
```
lib/
├── types.ts              # TypeScript definitions
├── utils.ts              # Utility functions
├── coherence/            # Domain logic
├── context/              # React contexts
└── data/                 # Seed data
```

### State Management Pattern

```typescript
// 1. Create typed context
interface AppContextValue {
  /* ... */
}
const AppContext = createContext<AppContextValue | undefined>(undefined);

// 2. Provider with state
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(/* ... */);
  return <AppContext.Provider value={/* ... */}>{children}</AppContext.Provider>;
}

// 3. Custom hook with error boundary
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

// 4. Specialized hooks
export function useSelectedPatient() {
  const { selectedPatientId } = useApp();
  return /* ... */;
}
```

**Key Principles:**
- Use React Context for global state (no Redux needed)
- Create specialized hooks for common queries
- Throw errors for context misuse
- Keep state close to where it's used

### Styling Guidelines

**Tailwind CSS Approach:**
```tsx
// ✅ Good: Utility classes in JSX
<div className="flex items-center gap-4 p-6 bg-background border rounded-lg">
  <Badge className="bg-primary text-primary-foreground">Active</Badge>
</div>

// ❌ Avoid: Inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

**Color System:**
```css
/* globals.css - HSL color variables */
:root {
  --primary: 190 100% 50%;      /* Cyan - technical/mathematical */
  --secondary: 300 100% 50%;    /* Magenta - creative/abstract */
  --accent: 142 76% 36%;        /* Green - success/action */
  --background: 222.2 84% 4.9%; /* Dark theme default */
}
```

**Component Styling:**
```tsx
import { cn } from "@/lib/utils"

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-card", className)} {...props} />
  )
}
```

### TypeScript Patterns

**Strict Mode Enabled:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Type Definitions:**
```typescript
// lib/types.ts - Domain models
export interface Domain {
  id: string;
  title: string;
  description: string;
  metrics: {
    coupling: number;
    clarity: number;
  };
}

export interface Patient {
  id: string;
  name: string;
  dob: Date;
  condition: string;
}

// Derived types
export type ViewMode = 'clinical' | 'myth';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
```

**Best Practices:**
- Define all domain models in `lib/types.ts`
- Use strict null checks
- Prefer interfaces for objects, types for unions
- Export types from barrel files

---

## Application-Specific Guidelines

### qote-app (Main Application)

**Routes:**
- `/` - Landing page with framework overview
- `/docs` - Documentation browser (reads from `docs/`)
- `/visualization` - Live canvas animation
- `/architecture` - Interactive architecture dashboard
- `/hopf-tree-lab` - Hopf algebra tree manipulation tool

**Key Features:**
1. **Hopf Algebra Tree Lab** (`app/hopf-tree-lab/`)
   - Custom tree data structures
   - Coproduct and antipode operations
   - SVG rendering with interactive nodes
   - Mathematical visualization unique to QOTE

2. **Architecture Dashboard** (`app/architecture/`)
   - "Local Domains" vs "Hinge Planes" concepts
   - Toggle between healthy/monolithic examples
   - Metrics: coupling, clarity, iteration speed
   - Educational tool for software architecture

3. **Documentation Browser** (`app/docs/`)
   - Dynamically reads from `docs/` directory
   - Markdown-like rendering of txt files
   - Navigation via INDEX.txt structure

**Adding New Routes:**
```bash
cd qote-app/app
mkdir new-route
touch new-route/page.tsx
```

```tsx
// new-route/page.tsx
export default function NewRoutePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">New Route</h1>
      {/* Content */}
    </div>
  )
}
```

### coherence-sentinel (Clinical Dashboard)

**Routes:**
- `/overview` - Dashboard overview
- `/patients` - Patient management
- `/signals` - Wearable/lab data monitoring
- `/coherence-engine` - Mathematical models
- `/alerts` - Alert management
- `/protocols` - Intervention protocols
- `/reports` - Report generation
- `/settings` - App configuration

**Key Features:**
1. **Myth Layer System**
   - Dual terminology: clinical ↔ poetic
   - Implemented in `lib/myth-labels.ts`
   - Example: "Coherence Index" → "Guardian Clarity"
   - Toggle in settings affects all UI labels
   - Data unchanged (label-only transformation)

2. **Demo Data Generation** (`lib/data/seed-data.ts`)
   - `generateWearableData()` - 90 days HRV/sleep
   - `generateLabData()` - Synthetic biomarkers
   - `generateDerivedMetrics()` - Computed coherence
   - `generateAlerts()` - Rule-based alerts
   - Generated once on mount (immutable)

3. **Context Architecture** (`lib/context/app-context.tsx`)
   - Centralized AppProvider
   - Patient selection state
   - View mode (clinical/myth)
   - Demo data storage

**Adding New Biomarker:**
```typescript
// 1. Update types (lib/types.ts)
export interface LabData {
  // ... existing fields
  newBiomarker?: number;
}

// 2. Update generator (lib/data/seed-data.ts)
export function generateLabData(patientId: string): LabData[] {
  return dates.map(date => ({
    // ... existing fields
    newBiomarker: Math.random() * 100,
  }));
}

// 3. Add to UI (app/signals/page.tsx or components)
<div>New Biomarker: {labData.newBiomarker}</div>
```

### governance-panels (Python Package)

**Structure:**
```
governance-panels/
├── models/               # Core mathematical models
│   ├── tord_core.py     # Reference Python implementation
│   └── tord_jax.py      # Production JAX version
├── panels/              # PDF panel generators
│   ├── engram_memory_panel.py
│   ├── hpa_stress_panel.py
│   └── development_boundary_panel.py
├── clinical/            # Clinical translation materials
├── figures/             # Generated PDF outputs
├── tests/               # Pytest tests
└── run_all_panels.py    # Orchestrator script
```

**TORD Model:**
- Delay differential equations
- Parameter: τ_delay (repair delay)
- JAX implementation for GPU acceleration
- Parameter sweeps for sensitivity analysis

**Generating Panels:**
```bash
# All panels
python run_all_panels.py

# Individual panel
python panels/engram_memory_panel.py

# With custom parameters
python panels/engram_memory_panel.py --delay 2.0 --duration 100
```

**Adding New Panel:**
```python
# panels/new_panel.py
import numpy as np
import matplotlib.pyplot as plt
from models.tord_jax import TORDModel

def generate_new_panel(output_path="figures/new_panel.pdf"):
    """Generate new biological panel."""
    model = TORDModel(tau_delay=1.5)
    t, x, y = model.solve(duration=50)

    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    # ... plotting code

    plt.savefig(output_path, bbox_inches='tight', dpi=300)
    plt.close()

if __name__ == "__main__":
    generate_new_panel()
```

---

## Git Workflow

### Branch Naming Convention

All feature branches follow the pattern: `claude/<descriptive-name>-<sessionId>`

**Examples:**
- `claude/add-claude-documentation-fTzu8`
- `claude/build-governance-panels-Z2fxJ`
- `claude/coherence-sentinel-dashboard-3yFXx`

**CRITICAL:** The `claude/` prefix and session ID suffix are **required** for push operations to succeed (403 error otherwise).

### Commit Message Pattern

Recent commits show a clear pattern:

```
Add <Feature Name>: <Brief Description>

Examples:
- "Add TORD Governance Panels: Complete biological governance framework"
- "Add Coherence Sentinel clinical monitoring dashboard"
- "Add interactive Geometric Software Architecture Dashboard"
```

**Pattern:**
- Start with imperative verb (Add, Fix, Update, Refactor)
- Capitalize first word
- Use descriptive feature name
- Optional: Add context after colon

### Development Workflow

1. **Create Feature Branch:**
```bash
git checkout -b claude/feature-name-abc123
```

2. **Develop and Commit:**
```bash
git add .
git commit -m "Add Feature Name: Brief description"
```

3. **Push to Remote:**
```bash
# CRITICAL: Use -u flag for new branches
git push -u origin claude/feature-name-abc123

# Retry logic for network failures (up to 4 times with exponential backoff)
# 2s, 4s, 8s, 16s
```

4. **Create Pull Request:**
```bash
# Using GitHub CLI
gh pr create --title "Feature Name" --body "Description"
```

5. **Merge via PR:**
- All merges go through pull requests
- Commit message pattern: "Merge pull request #N from owner/branch"
- Squash commits if appropriate

### Common Git Operations

```bash
# Check status
git status

# View recent commits
git log --oneline -10

# Fetch specific branch
git fetch origin claude/branch-name

# Pull latest changes
git pull origin claude/branch-name

# Rebase on main (if needed)
git fetch origin main
git rebase origin/main
```

---

## Configuration Files Reference

### TypeScript Configuration

**qote-app/tsconfig.json & coherence-sentinel/tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  }
}
```

**Key Settings:**
- `strict: true` - Maximum type safety
- `jsx: "preserve"` - Next.js handles JSX transformation
- `@/*` path alias - Import from project root
- `moduleResolution: "bundler"` - Optimized for modern bundlers

### Tailwind Configuration

**Shared Pattern (tailwind.config.ts):**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
    },
  },
  plugins: [],
};

export default config;
```

**Pattern:**
- Scans all component files
- Extends default theme (doesn't replace)
- Uses HSL CSS variables for theming
- No plugins (vanilla Tailwind)

### Next.js Configuration

**coherence-sentinel/next.config.mjs:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

export default nextConfig;
```

**qote-app uses defaults (no next.config.mjs present).**

**Key Settings:**
- `reactStrictMode: true` - Development warnings/checks
- `output: 'standalone'` - Self-contained build for containerization
- No custom webpack config (uses Next.js defaults)
- No image domains (using Lucide icons, not external images)

### Vercel Configuration

**Root vercel.json (deploys qote-app):**
```json
{
  "buildCommand": "cd qote-app && npm run build",
  "devCommand": "cd qote-app && npm run dev",
  "installCommand": "cd qote-app && npm install",
  "outputDirectory": "qote-app/.next"
}
```

**qote-app/vercel.json:**
```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/:path*"
    }
  ]
}
```

**Pattern:**
- Root config deploys qote-app as main site
- coherence-sentinel can be deployed as separate Vercel project
- No environment variables required (demo data)
- Static optimization where possible

---

## Documentation Structure

The repository uses **plain text documentation** (not Markdown) with a hierarchical structure:

### Master Documentation Map

| Document | Location | Audience | Purpose |
|----------|----------|----------|---------|
| **INDEX.txt** | `docs/` | Everyone | Master navigation map |
| **QUICK_REFERENCE.txt** | `docs/` | First-timers | 5-minute overview |
| **EXECUTIVE_SUMMARY.txt** | `docs/` | Stakeholders | Strategic briefing |
| **QOTE_ALPHAEVOLVE_QUICK_CARD.txt** | `docs/` | Builders | Field reference card |
| **RESONA_MYTHIC_TRANSMISSION.txt** | `docs/` | Visionaries | Poetic narrative |
| **QOTE_ALPHAEVOLVE_TECHNICAL_DOC.txt** | `technical/` | Engineers | Technical specs |
| **QOTE_ALPHAEVOLVE_RESEARCH_PROTOCOL.txt** | `technical/` | Researchers | Experimental protocols |

### When Adding Documentation

1. **New Framework Concepts**: Add to `docs/`
2. **Implementation Details**: Add to `technical/`
3. **API References**: Add to application `README.md`
4. **Research Protocols**: Add to `technical/`
5. **Update INDEX.txt** to reference new documents

**Format:**
```
═══════════════════════════════════════════════════════════════════════════════
  DOCUMENT TITLE
  Subtitle or Description
═══════════════════════════════════════════════════════════════════════════════

Version: 1.0
Last Updated: YYYY-MM-DD
Type: Technical / Narrative / Protocol

Content...
```

---

## Testing Strategy

### Current State

**Frontend (qote-app & coherence-sentinel):**
- ❌ No test scripts in `package.json`
- ⚠️ Playwright mentioned in `package-lock.json` (dev dependency)
- Status: Research prototype - manual testing

**Backend (governance-panels):**
- ✅ `pytest` in `requirements.txt`
- ✅ `tests/` directory present
- Status: Basic test coverage for TORD models

### When Adding Tests

**Frontend (Next.js Apps):**
```bash
# Install testing library
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Add to package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}

# Create jest.config.js
```

**Python Package:**
```bash
# Run existing tests
cd governance-panels
pytest tests/

# Add new test
# tests/test_new_feature.py
import pytest
from models.tord_core import TORDModel

def test_tord_initialization():
    model = TORDModel(tau_delay=1.0)
    assert model.tau_delay == 1.0
```

---

## Common Development Tasks

### Adding a New UI Component

```bash
# 1. Create component file
touch qote-app/components/NewComponent.tsx

# 2. Define component
cat > qote-app/components/NewComponent.tsx << 'EOF'
import { cn } from "@/lib/utils"

interface NewComponentProps {
  title: string
  className?: string
}

export function NewComponent({ title, className }: NewComponentProps) {
  return (
    <div className={cn("p-4 border rounded-lg", className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  )
}
EOF

# 3. Use in page
# Edit app/some-route/page.tsx to import and use
```

### Adding a New Route

```bash
# qote-app example
cd qote-app/app
mkdir new-feature
touch new-feature/page.tsx
touch new-feature/layout.tsx  # Optional

# Create page component
cat > new-feature/page.tsx << 'EOF'
export default function NewFeaturePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">New Feature</h1>
      {/* Content */}
    </div>
  )
}
EOF
```

### Updating Myth Layer Labels

```typescript
// coherence-sentinel/lib/myth-labels.ts
export const mythLabels: Record<string, { clinical: string; myth: string }> = {
  // Existing labels...

  // Add new label
  newMetric: {
    clinical: "New Clinical Metric",
    myth: "The Celestial Resonance"
  }
}

// Use in component
import { mythLabels } from "@/lib/myth-labels"
import { useApp } from "@/lib/context/app-context"

function Component() {
  const { viewMode } = useApp()
  return <div>{mythLabels.newMetric[viewMode]}</div>
}
```

### Adding Data to Context

```typescript
// coherence-sentinel/lib/context/app-context.tsx

// 1. Update context interface
interface AppContextValue {
  // Existing fields...
  newData: SomeType[]
  updateNewData: (data: SomeType[]) => void
}

// 2. Add to provider state
export function AppProvider({ children }: { children: ReactNode }) {
  const [newData, setNewData] = useState<SomeType[]>([])

  const updateNewData = useCallback((data: SomeType[]) => {
    setNewData(data)
  }, [])

  return (
    <AppContext.Provider value={{ /* ... */ newData, updateNewData }}>
      {children}
    </AppContext.Provider>
  )
}
```

### Debugging Build Issues

```bash
# Clear Next.js cache
rm -rf qote-app/.next
rm -rf coherence-sentinel/.next

# Clear node_modules (if dependency issue)
rm -rf qote-app/node_modules
rm -rf coherence-sentinel/node_modules
cd qote-app && npm install
cd ../coherence-sentinel && npm install

# Check TypeScript errors
cd qote-app && npx tsc --noEmit
cd coherence-sentinel && npx tsc --noEmit

# Build locally to catch errors
npm run build
```

---

## Special Features Deep Dive

### 1. Myth Layer System (coherence-sentinel)

**Purpose:** Dual UI mode allowing users to toggle between clinical and poetic terminology.

**Implementation:**
```typescript
// lib/myth-labels.ts
export const mythLabels = {
  coherenceIndex: {
    clinical: "Coherence Index",
    myth: "Guardian Clarity"
  },
  hrvVariability: {
    clinical: "HRV Variability",
    myth: "Breath Rhythm Flow"
  }
  // ... more labels
}

// lib/context/app-context.tsx
const [viewMode, setViewMode] = useState<'clinical' | 'myth'>('clinical')

// Usage in components
const { viewMode } = useApp()
<span>{mythLabels.coherenceIndex[viewMode]}</span>
```

**Adding New Labels:**
1. Add to `mythLabels` object
2. Use in components via `viewMode`
3. Toggle in settings updates all UI

**Key Insight:** Data remains unchanged—only labels transform. This maintains data integrity while providing narrative flexibility.

### 2. Hopf Algebra Tree Lab (qote-app)

**Purpose:** Interactive mathematical tool for manipulating rooted trees using Hopf algebra operations.

**Operations:**
- **Coproduct**: Decomposes tree into pairs
- **Antipode**: Computes algebraic inverse
- **Product**: Combines trees

**Implementation:** Custom tree data structures with SVG rendering.

**Located in:** `qote-app/app/hopf-tree-lab/`

**Use Case:** Educational tool for understanding QOTE's mathematical foundations.

### 3. TORD Scientific Computing

**Purpose:** Simulate biological governance patterns using delay differential equations.

**Key Parameters:**
- `τ_delay`: Repair delay (key biological parameter)
- `duration`: Simulation time
- `dt`: Time step

**Models:**
- `tord_core.py`: Reference implementation
- `tord_jax.py`: GPU-accelerated version

**Panel Generators:**
Each panel explores a specific biological domain:
- Engram memory persistence
- HPA stress response
- Developmental boundaries

**Output:** PDF visualizations + CSV data for reproducibility.

### 4. Coherence Metric (Δθ_total)

**Mathematical Definition:**
```
Δθ_total = Σᵢ |Δθᵢ|  (cumulative phase shift)

Zones:
  Safe:    Δθ_total < π      ✓ High coherence
  Caution: π ≤ Δθ_total < 2π ⚠ Decreased coherence
  Danger:  Δθ_total ≥ 2π     ✗ Pause & consolidate
```

**Implementation:** Tracked in coherence-sentinel dashboard.

**Purpose:** Built-in constraint mirroring biological regulation, keeping AI discovery both novel and understandable.

---

## Deployment Guide

### Vercel Deployment (Primary)

**qote-app (Main Site):**
```bash
# Automatic deployment on push to main
git push origin main

# Vercel auto-detects and deploys using root vercel.json
# Build: cd qote-app && npm run build
# Output: qote-app/.next
```

**coherence-sentinel (Separate Project):**
```bash
# Option 1: Vercel CLI
cd coherence-sentinel
vercel

# Option 2: GitHub integration
# Create new Vercel project
# Set Root Directory: coherence-sentinel
# Build Command: npm run build
# Output Directory: .next
```

**Environment Variables:**
- ✅ None required (demo data)
- ✅ No API keys needed
- ✅ All data generated client-side

### Manual Deployment (Alternative)

**Static Export:**
```bash
# Add to next.config.mjs
const nextConfig = {
  output: 'export',
}

# Build and export
npm run build
# Output: out/ directory

# Deploy to any static host (Netlify, GitHub Pages, etc.)
```

**Standalone Server:**
```bash
# Build with standalone output
npm run build

# Output includes:
# .next/standalone/ - Self-contained server
# .next/static/ - Static assets

# Deploy to VPS or container
```

### Python Package Deployment

**Local Usage:**
```bash
pip install -r requirements.txt
python run_all_panels.py
```

**Docker (if needed):**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY governance-panels/requirements.txt .
RUN pip install -r requirements.txt

COPY governance-panels/ .
CMD ["python", "run_all_panels.py"]
```

---

## Troubleshooting Guide

### Build Errors

**TypeScript Type Errors:**
```bash
# Check all type errors
npx tsc --noEmit

# Common fixes:
# 1. Missing type definitions
npm install -D @types/node @types/react

# 2. Strict mode violations
# Review tsconfig.json and fix null checks
```

**Tailwind CSS Not Applying:**
```bash
# 1. Check content paths in tailwind.config.ts
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
]

# 2. Verify globals.css imported in app/layout.tsx
import "./globals.css"

# 3. Clear cache
rm -rf .next
npm run dev
```

**Module Resolution Errors:**
```bash
# 1. Check tsconfig.json paths
"paths": { "@/*": ["./*"] }

# 2. Restart TypeScript server in IDE
# VSCode: Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# 3. Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Runtime Errors

**Context Errors (useApp outside provider):**
```
Error: useApp must be used within AppProvider
```
**Fix:** Ensure component is wrapped in `<AppProvider>` in `app/layout.tsx`

**Canvas Rendering Issues:**
```
Cannot read property 'getContext' of null
```
**Fix:** Ensure canvas ref is initialized in `useEffect`, check for null:
```typescript
useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  // ... rendering
}, [])
```

### Development Server Issues

**Port Already in Use:**
```bash
# Find process on port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
next dev -p 3002
```

**Hot Reload Not Working:**
```bash
# 1. Check file system watcher limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 2. Restart dev server
npm run dev
```

### Python Environment Issues

**Module Not Found:**
```bash
# Ensure virtual environment active
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

**JAX GPU Issues:**
```bash
# CPU-only fallback
pip install jax[cpu]

# Check JAX devices
python -c "import jax; print(jax.devices())"
```

---

## Performance Optimization

### Next.js App Optimization

**Image Optimization:**
```tsx
import Image from 'next/image'

// Use Next.js Image component (currently not used, using Lucide icons)
<Image src="/image.png" width={400} height={300} alt="Description" />
```

**Code Splitting:**
```tsx
import dynamic from 'next/dynamic'

// Lazy load heavy components
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

**Server Components:**
```tsx
// Default in App Router - no 'use client' = Server Component
export default async function Page() {
  // Can fetch data directly
  const data = await fetchData()
  return <div>{data}</div>
}
```

### Bundle Size Analysis

```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Add to next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Analyze bundle
ANALYZE=true npm run build
```

### Tailwind CSS Optimization

**Built-in via Purge (automatic):**
- Scans content files
- Removes unused classes
- Minifies output

**Manual Optimization:**
```javascript
// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",  // Only include actual source
  ],
  // Avoid wildcards that include node_modules
}
```

---

## Security Considerations

### Current Security Posture

**Frontend:**
- ✅ No sensitive data (demo data only)
- ✅ No authentication required
- ✅ No API endpoints exposing data
- ✅ Client-side only state
- ⚠️ No CSRF protection (not needed - no mutations)
- ⚠️ No XSS protection beyond React defaults

**Python:**
- ✅ No network exposure (local scripts)
- ✅ No user input processing
- ⚠️ File I/O (trusted inputs only)

### If Adding Authentication

```bash
# Install NextAuth.js
npm install next-auth

# Create app/api/auth/[...nextauth]/route.ts
# Configure providers and callbacks
```

### If Adding API Routes

```typescript
// app/api/route.ts
export async function POST(request: Request) {
  // Validate input
  const body = await request.json()
  // Sanitize data
  // Process request
  return Response.json({ success: true })
}
```

**Best Practices:**
- Validate all inputs
- Sanitize user-generated content
- Use HTTPS in production
- Implement rate limiting for API routes
- Use environment variables for secrets

---

## Code Quality Standards

### TypeScript

**Rules:**
- ✅ Strict mode enabled
- ✅ No `any` types (use `unknown` if needed)
- ✅ Explicit return types for functions
- ✅ Interface over type for objects
- ✅ Prefer `const` over `let`

**Example:**
```typescript
// ✅ Good
interface User {
  id: string
  name: string
}

function getUser(id: string): User | null {
  // Implementation
  return null
}

// ❌ Avoid
function getUser(id: any): any {
  return null
}
```

### React Components

**Rules:**
- ✅ Functional components (no class components)
- ✅ Named exports for components
- ✅ Props interface with descriptive names
- ✅ Use `children` for composition
- ✅ Extract complex logic to custom hooks

**Example:**
```typescript
// ✅ Good
interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={cn("border rounded-lg p-4", className)}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

// ❌ Avoid
export default function Card(props: any) {
  return <div>{props.children}</div>
}
```

### CSS/Styling

**Rules:**
- ✅ Tailwind utility classes only
- ✅ Use `cn()` helper for conditional classes
- ✅ CSS variables for theming
- ❌ No inline styles
- ❌ No styled-components

**Example:**
```typescript
// ✅ Good
import { cn } from "@/lib/utils"

<div className={cn(
  "flex items-center gap-4",
  isActive && "bg-primary",
  className
)} />

// ❌ Avoid
<div style={{ display: 'flex', gap: '16px' }} />
```

### Python

**Rules:**
- ✅ PEP 8 style guide
- ✅ Type hints for function signatures
- ✅ Docstrings for public functions
- ✅ NumPy-style docstrings for scientific code

**Example:**
```python
# ✅ Good
def solve_tord(tau_delay: float, duration: float) -> tuple[np.ndarray, np.ndarray]:
    """
    Solve TORD delay differential equation.

    Parameters
    ----------
    tau_delay : float
        Repair delay parameter
    duration : float
        Simulation duration in time units

    Returns
    -------
    t : np.ndarray
        Time points
    x : np.ndarray
        State trajectory
    """
    # Implementation
    return t, x
```

---

## Resources and References

### Internal Documentation

- **START HERE**: [`docs/INDEX.txt`](docs/INDEX.txt) - Master navigation
- **Quick Onboarding**: [`docs/QUICK_REFERENCE.txt`](docs/QUICK_REFERENCE.txt)
- **Technical Specs**: [`technical/QOTE_ALPHAEVOLVE_TECHNICAL_DOC.txt`](technical/QOTE_ALPHAEVOLVE_TECHNICAL_DOC.txt)
- **Research Protocols**: [`technical/QOTE_ALPHAEVOLVE_RESEARCH_PROTOCOL.txt`](technical/QOTE_ALPHAEVOLVE_RESEARCH_PROTOCOL.txt)

### Framework Documentation

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/primitives/docs

### Scientific Computing

- **NumPy**: https://numpy.org/doc
- **SciPy**: https://docs.scipy.org
- **JAX**: https://jax.readthedocs.io
- **Matplotlib**: https://matplotlib.org/stable/contents.html

### Deployment

- **Vercel**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Key Architectural Decisions

### Why Monorepo?

**Rationale:**
- Related projects under unified framework
- Shared documentation and deployment
- Single source of truth for QOTE framework
- Easy cross-referencing between apps and docs

**Trade-offs:**
- Larger repository size
- Individual deployments require configuration
- Benefits outweigh costs for this use case

### Why No State Management Library?

**Rationale:**
- React Context sufficient for current complexity
- Demo data (no complex mutations)
- Simpler mental model for contributors
- No network state synchronization needed

**When to reconsider:**
- Real backend integration
- Complex state machines
- Optimistic updates required

### Why Plain Text Documentation?

**Rationale:**
- Human-readable without rendering
- Git-friendly (clean diffs)
- No build process required
- Terminal-friendly (cat/less)
- Consumed by qote-app docs browser

**Format:** Structured text with ASCII art borders

### Why Multiple Apps Instead of Monolith?

**Rationale:**
- **qote-app**: Public-facing, educational
- **coherence-sentinel**: Clinical, specialized audience
- **governance-panels**: Scientific computing, different runtime
- Separation of concerns by domain
- Independent deployment flexibility

---

## Contribution Guidelines for AI Assistants

### When Making Changes

1. **Read Before Editing:**
   - Always read files before modifying
   - Understand existing patterns
   - Match current code style

2. **Type Safety:**
   - Add types to `lib/types.ts`
   - Use strict TypeScript
   - No `any` types

3. **Component Structure:**
   - Follow existing organization
   - UI primitives in `components/ui/`
   - Feature components at root
   - Use shadcn/ui patterns

4. **State Management:**
   - Add to existing Context if global
   - Use local state if component-specific
   - Create custom hooks for reusable logic

5. **Styling:**
   - Tailwind utility classes only
   - Use CSS variables for colors
   - Match existing theme

6. **Documentation:**
   - Update relevant docs files
   - Add comments for complex logic
   - Update this CLAUDE.md if adding conventions

### Code Review Checklist

- [ ] TypeScript compiles without errors
- [ ] Follows existing naming conventions
- [ ] Styled with Tailwind (no inline styles)
- [ ] Types defined in `lib/types.ts`
- [ ] Context updated if global state changed
- [ ] Documentation updated if needed
- [ ] Builds successfully (`npm run build`)
- [ ] Tested locally with `npm run dev`

### Git Commit Checklist

- [ ] Branch name: `claude/<feature>-<sessionId>`
- [ ] Commit message: Imperative, descriptive
- [ ] Code formatted and linted
- [ ] No console.log left in code (unless intentional)
- [ ] No commented-out code blocks

---

## Quick Reference Commands

### Development

```bash
# Start all services
cd qote-app && npm run dev &            # Port 3000
cd coherence-sentinel && npm run dev &  # Port 3001
cd governance-panels && python run_all_panels.py

# Build all
cd qote-app && npm run build
cd coherence-sentinel && npm run build
cd governance-panels && python run_all_panels.py

# Type check
cd qote-app && npx tsc --noEmit
cd coherence-sentinel && npx tsc --noEmit

# Lint
cd qote-app && npm run lint
cd coherence-sentinel && npm run lint
```

### Git

```bash
# Create feature branch
git checkout -b claude/feature-name-abc123

# Commit and push
git add .
git commit -m "Add Feature: Description"
git push -u origin claude/feature-name-abc123

# Create PR
gh pr create --title "Feature Name" --body "Description"
```

### Deployment

```bash
# Deploy qote-app (main site)
git push origin main  # Auto-deploys via Vercel

# Deploy coherence-sentinel (separate)
cd coherence-sentinel && vercel
```

### Troubleshooting

```bash
# Clear caches
rm -rf .next node_modules package-lock.json
npm install

# Check TypeScript
npx tsc --noEmit

# Kill port
kill -9 $(lsof -ti:3000)
```

---

## Contact and Support

### Documentation

- **Start Here**: `docs/INDEX.txt`
- **Technical Details**: `technical/QOTE_ALPHAEVOLVE_TECHNICAL_DOC.txt`
- **Quick Reference**: `docs/QUICK_REFERENCE.txt`

### Repository Structure

- **Main App**: `qote-app/` (Next.js, port 3000)
- **Clinical Dashboard**: `coherence-sentinel/` (Next.js, port 3001)
- **Scientific Computing**: `governance-panels/` (Python)
- **Documentation**: `docs/` and `technical/`

### Key Files for AI Assistants

- **This file**: `CLAUDE.md` - Comprehensive development guide
- **README.md**: Project overview and package contents
- **docs/INDEX.txt**: Documentation navigation
- **package.json**: Dependencies and scripts (per app)
- **tsconfig.json**: TypeScript configuration (per app)
- **tailwind.config.ts**: Tailwind configuration (per app)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-29 | Initial CLAUDE.md creation |

---

**End of CLAUDE.md**

*For comprehensive framework documentation, see `docs/INDEX.txt`*
*For technical implementation details, see `technical/QOTE_ALPHAEVOLVE_TECHNICAL_DOC.txt`*
