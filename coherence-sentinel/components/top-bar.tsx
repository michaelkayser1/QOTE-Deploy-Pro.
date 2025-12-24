'use client';

import { PatientSelector } from './patient-selector';
import { ModeToggle } from './mode-toggle';
import { useApp } from '@/lib/context/app-context';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function TopBar() {
  const { dateRange } = useApp();

  return (
    <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      {/* Left: Patient selector */}
      <div className="flex items-center gap-4">
        <PatientSelector />

        {/* Date range display */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </span>
        </div>
      </div>

      {/* Right: Mode toggles */}
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </div>
  );
}
