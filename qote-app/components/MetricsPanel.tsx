'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArchitectureMetrics } from '@/lib/types';
import { TrendingUp } from 'lucide-react';

interface MetricsPanelProps {
  metrics: ArchitectureMetrics;
}

function getMetricColor(value: number, invertGood: boolean = false): string {
  const threshold = invertGood ?
    { good: 40, medium: 70 } :
    { good: 60, medium: 40 };

  if (invertGood) {
    if (value <= threshold.good) return 'text-green-500';
    if (value <= threshold.medium) return 'text-yellow-500';
    return 'text-red-500';
  } else {
    if (value >= threshold.good) return 'text-green-500';
    if (value >= threshold.medium) return 'text-yellow-500';
    return 'text-red-500';
  }
}

function getMetricStatus(value: number, invertGood: boolean = false): string {
  const threshold = invertGood ?
    { good: 40, medium: 70 } :
    { good: 60, medium: 40 };

  if (invertGood) {
    if (value <= threshold.good) return 'Low coupling';
    if (value <= threshold.medium) return 'Medium coupling';
    return 'High coupling';
  } else {
    if (value >= threshold.good) return 'Good';
    if (value >= threshold.medium) return 'Fair';
    return 'Needs improvement';
  }
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Architecture Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Coupling Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h4 className="text-sm font-semibold">Coupling Score</h4>
              <span className={`text-2xl font-bold ${getMetricColor(metrics.coupling, true)}`}>
                {metrics.coupling}
              </span>
            </div>
            <Progress value={metrics.coupling} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getMetricStatus(metrics.coupling, true)}
            </p>
            <p className="text-xs text-muted-foreground">
              Measures unnecessary dependencies between domains
            </p>
          </div>

          {/* Hinge Clarity */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h4 className="text-sm font-semibold">Hinge Clarity</h4>
              <span className={`text-2xl font-bold ${getMetricColor(metrics.hingeClarity)}`}>
                {metrics.hingeClarity}
              </span>
            </div>
            <Progress value={metrics.hingeClarity} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getMetricStatus(metrics.hingeClarity)}
            </p>
            <p className="text-xs text-muted-foreground">
              Measures constraint quality at boundaries
            </p>
          </div>

          {/* Iteration Speed */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h4 className="text-sm font-semibold">Iteration Speed</h4>
              <span className="text-2xl font-bold text-primary">
                {metrics.iterationSpeed}
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">+3.2 from last month</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Deployments per week
            </p>
            <p className="text-xs text-muted-foreground">
              Features shipped without breaking existing systems
            </p>
          </div>

          {/* Curvature Index */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h4 className="text-sm font-semibold">Curvature Index</h4>
              <span className={`text-2xl font-bold ${getMetricColor(metrics.curvature)}`}>
                {metrics.curvature}
              </span>
            </div>
            <Progress value={metrics.curvature} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {getMetricStatus(metrics.curvature)}
            </p>
            <p className="text-xs text-muted-foreground">
              System&apos;s ability to guide users toward success
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
