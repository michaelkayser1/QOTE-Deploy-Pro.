'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertBadgeProps {
  severity: 'low' | 'medium' | 'high';
  className?: string;
  showIcon?: boolean;
}

export function AlertBadge({ severity, className, showIcon = true }: AlertBadgeProps) {
  const styles = {
    low: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      Icon: Info
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      Icon: AlertCircle
    },
    high: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      Icon: AlertTriangle
    }
  };

  const style = styles[severity];
  const Icon = style.Icon;

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
      style.bg,
      style.text,
      style.border,
      className
    )}>
      {showIcon && <Icon className="h-3 w-3" />}
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const styles = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      styles[level],
      className
    )}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </span>
  );
}
