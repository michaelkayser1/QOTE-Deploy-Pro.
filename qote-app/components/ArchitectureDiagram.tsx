'use client';

import { useState } from 'react';
import { DomainCard } from './DomainCard';
import { HingePlane } from './HingePlane';
import { MetricsPanel } from './MetricsPanel';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArchitectureExample, ArchitectureState } from '@/lib/types';
import { healthyV0Architecture, monolithicArchitecture } from '@/lib/examples';

export function ArchitectureDiagram() {
  const [architectureState, setArchitectureState] = useState<ArchitectureState>('healthy');
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [hoveredHinge, setHoveredHinge] = useState<string | null>(null);

  const currentExample: ArchitectureExample =
    architectureState === 'healthy' ? healthyV0Architecture : monolithicArchitecture;

  // Determine which domains and hinges should be highlighted
  const getHighlightedDomains = (): Set<string> => {
    const highlighted = new Set<string>();

    if (hoveredDomain) {
      highlighted.add(hoveredDomain);
    }

    if (hoveredHinge) {
      const hinge = currentExample.hinges.find(h => h.id === hoveredHinge);
      if (hinge) {
        highlighted.add(hinge.fromDomain);
        highlighted.add(hinge.toDomain);
      }
    }

    return highlighted;
  };

  const getHighlightedHinges = (): Set<string> => {
    const highlighted = new Set<string>();

    if (hoveredHinge) {
      highlighted.add(hoveredHinge);
    }

    if (hoveredDomain) {
      currentExample.hinges
        .filter(h => h.fromDomain === hoveredDomain || h.toDomain === hoveredDomain)
        .forEach(h => highlighted.add(h.id));
    }

    return highlighted;
  };

  const highlightedDomains = getHighlightedDomains();
  const highlightedHinges = getHighlightedHinges();

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Geometric Software Architecture
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Interactive visualization of Local Domains and Hinge Planes in the v0 architecture
        </p>

        {/* Architecture State Toggle */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setArchitectureState('healthy')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              architectureState === 'healthy'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Healthy Architecture
          </button>
          <button
            onClick={() => setArchitectureState('monolithic')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              architectureState === 'monolithic'
                ? 'bg-destructive text-destructive-foreground shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Monolithic Architecture
          </button>
        </div>

        <Badge variant="outline" className="text-sm">
          {currentExample.name}
        </Badge>
      </div>

      <Separator />

      {/* Domains Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Local Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {currentExample.domains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              isHighlighted={highlightedDomains.has(domain.id)}
              onHover={setHoveredDomain}
            />
          ))}
        </div>
      </div>

      {/* Hinges Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Hinge Planes</h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Constrained interfaces that perform geometric rotations between domains
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {currentExample.hinges.map((hinge) => (
            <HingePlane
              key={hinge.id}
              hinge={hinge}
              isHighlighted={highlightedHinges.has(hinge.id)}
              onHover={setHoveredHinge}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Metrics Section */}
      <div>
        <MetricsPanel metrics={currentExample.metrics} />
      </div>

      {/* Educational Footer */}
      <div className="text-center text-sm text-muted-foreground space-y-2 pt-8">
        <p>
          <strong className="text-foreground">Hover</strong> over domains or hinges to see their relationships
        </p>
        <p>
          Toggle between <strong className="text-foreground">Healthy</strong> and{' '}
          <strong className="text-foreground">Monolithic</strong> to see the impact of architectural choices
        </p>
      </div>
    </div>
  );
}
