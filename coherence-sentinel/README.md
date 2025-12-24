# Coherence Sentinel

A clinical-style monitoring dashboard for tracking coherence signals (HRV/CGM/labs + derived metrics) with optional mythic overlay.

## Features

- **Clinical Dashboard**: Clean, professional interface for monitoring patient coherence metrics
- **Myth Layer Toggle**: Switch between clinical labels and poetic/mythic interpretations
- **Patient Management**: Demo patients with 90 days of time-series data
- **Signals Tracking**: Wearables (HRV, sleep), Labs (glucose, lactate), Derived metrics (φ-proximity, wobble budget)
- **Coherence Engine**: Mathematical models and simulators for coherence calculations
- **Alert System**: Rules-based monitoring with configurable thresholds
- **Protocol Builder**: Template-based intervention protocols
- **Report Generation**: Comprehensive patient reports

## Privacy & Disclaimers

- **Demo/research prototype only**
- **Not medical advice**
- **Private by default** - no sharing or public posting features
- All data is local/demo

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
coherence-sentinel/
├── app/                    # Next.js App Router pages
│   ├── overview/          # Dashboard overview
│   ├── patients/          # Patient list and details
│   ├── signals/           # Signals monitoring
│   ├── coherence-engine/  # Math models and simulators
│   ├── alerts/            # Alert management
│   ├── protocols/         # Protocol builder
│   ├── reports/           # Report generation
│   └── settings/          # App settings
├── components/            # Reusable React components
├── lib/                   # Utilities and business logic
│   ├── coherence/        # Coherence calculation algorithms
│   ├── data/             # Seed data and generators
│   └── utils/            # Helper functions
└── public/               # Static assets
```

## Key Concepts

### Coherence Index (0-100)
Composite metric combining autonomic stability, metabolic drift, and φ-proximity.

### φ-Proximity (0-1)
Derived metric tracking alignment to mathematical coherence patterns (placeholder PCA/eigenspectra pipeline).

### Wobble Budget
Protected exploration capacity - how much "productive instability" is available.

### Rank Collapse Risk
Indicator of representation monoculture or excessive system rigidity.

## Myth Layer

The "Myth Layer" provides alternative labels and poetic subtitles without changing underlying data:

- Coherence Index → "Guardian Clarity"
- Alerts → "Rim Warnings"
- Next Best Actions → "Deliberate Wobble Moves"

Toggle between modes in Settings or via the top bar.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: Radix UI
- **Icons**: Lucide React
