'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hinge } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface HingePlaneProps {
  hinge: Hinge;
  isHighlighted?: boolean;
  onHover?: (hingeId: string | null) => void;
}

export function HingePlane({ hinge, isHighlighted = false, onHover }: HingePlaneProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-md',
        isHighlighted && 'ring-2 ring-accent shadow-lg'
      )}
      onMouseEnter={() => onHover?.(hinge.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with Icon and Label */}
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={hinge.label}>
            {hinge.icon}
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{hinge.label}</h3>
            <Badge variant="secondary" className="text-xs mt-1">
              {hinge.rotationType}
            </Badge>
          </div>
        </div>

        {/* Constraint */}
        <div className="bg-muted/30 rounded p-2 border border-border">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Constraint:</p>
          <p className="text-xs">{hinge.constraint}</p>
        </div>

        {/* Transformation */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold">Transformation:</p>
          <div className="flex flex-col gap-2">
            <div className="bg-background border border-border rounded p-2">
              <p className="text-xs font-mono text-destructive">Before:</p>
              <p className="text-xs mt-1">{hinge.transformation.before}</p>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-accent" />
            </div>
            <div className="bg-background border border-border rounded p-2">
              <p className="text-xs font-mono text-accent">After:</p>
              <p className="text-xs mt-1">{hinge.transformation.after}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
