'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subtitle,
  trend,
  trendValue,
  variant = 'default',
  className
}: MetricCardProps) {
  const variantStyles = {
    default: 'border-gray-200 bg-white',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div className={cn(
      'rounded-lg border-2 p-6 transition-all hover:shadow-md',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1">
            {label}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500 italic mb-2">
              {subtitle}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-gray-900">
              {value}
            </div>
            {unit && (
              <div className="text-lg text-gray-600">
                {unit}
              </div>
            )}
          </div>
        </div>
        {trend && (
          <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
            <TrendIcon className="h-4 w-4" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
