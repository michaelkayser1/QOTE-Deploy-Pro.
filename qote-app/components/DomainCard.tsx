'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Domain } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DomainCardProps {
  domain: Domain;
  isHighlighted?: boolean;
  onHover?: (domainId: string | null) => void;
}

export function DomainCard({ domain, isHighlighted = false, onHover }: DomainCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        isHighlighted && 'ring-2 ring-primary shadow-xl'
      )}
      onMouseEnter={() => onHover?.(domain.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{domain.title}</CardTitle>
        <CardDescription className="text-base">{domain.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coherence Rules */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
            Internal Coherence Rules
          </h4>
          <ul className="space-y-1">
            {domain.coherenceRules.map((rule, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Current State */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Current State</h4>
          <div className="bg-muted/50 rounded-md p-3 border border-border">
            <p className="text-xs font-mono text-accent">{domain.currentState.description}</p>
            {domain.currentState.visual && (
              <p className="text-sm mt-2 italic">&quot;{domain.currentState.visual}&quot;</p>
            )}
          </div>
        </div>

        {/* Export Format */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Export Format</h4>
          <Badge variant="outline" className="mb-2">
            {domain.exportFormat.type.toUpperCase()}
          </Badge>
          <pre className="bg-background border border-border rounded-md p-3 text-xs overflow-x-auto">
            <code>{domain.exportFormat.content}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
